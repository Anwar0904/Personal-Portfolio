import { PasswordService } from "@/lib/auth/bcrypt";
import { ApiError } from "@/lib/api/api-error";
import SessionRepository from "@/repositories/session.repository";
import { env } from "@/config/env";
import { RegisterInput, LoginInput } from "@/types/auth";
import crypto from "crypto"
import { User } from "@/models/user.model";
import { Role } from "@/models/role.model";
import mongoose from "mongoose";
import { JwtService } from "@/lib/auth/jwt";
import { ResetTokenService } from "@/lib/auth/reset-token";
import { ResetPasswordInput } from "@/validators/auth";
import { ChangePasswordInput } from "@/validators/auth/change-password.validator";

export function clearEmailVerificationFields(user: {
    emailVerificationToken?: string | null;
    emailVerificationExpires?: Date | null;
}) {
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
}

class AuthService {
    async register(data: RegisterInput) {
        const { name, email, password } = data;
        const nameParts = name.trim().split(/\s+/);
        const firstName = nameParts[0] ?? name;
        const lastName = nameParts.slice(1).join(" ");

        // Check if email already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase(),
        });

        if (existingUser) {
            throw new ApiError(409, "Email already exists.");
        }

        // Find the default role (User)
        let defaultRole = await Role.findOne({
            isDefault: true,
        });

        if (!defaultRole) {
            defaultRole = await Role.findOne({
                name: { $regex: /^user$/i },
            });
        }

        if (!defaultRole) {
            defaultRole = await Role.create({
                name: "user",
                description: "Default user",
                permissions: [],
                isDefault: true,
                status: "active",
            });
        }

        // Hash password
        const hashedPassword =
            await PasswordService.hash(password);

        // Generate verification token
        const verificationToken =
            ResetTokenService.generate();

        const hashedVerificationToken =
            ResetTokenService.hash(
                verificationToken
            );

        // Create user
        const user = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: defaultRole._id,

            emailVerified: false,
            emailVerificationToken:
                hashedVerificationToken,
            emailVerificationExpires:
                ResetTokenService.expiry(),
        });

        const createdUser = await User.findById(user._id).select(
            "email emailVerificationToken emailVerificationExpires emailVerified"
        );

        return {
            user,
            verificationToken,
        };

    }

    async login(data: LoginInput) {
        const { email, password } = data;

        // Find user by email
        const user = await User.findOne({
            email: email.toLowerCase(),
        })
            .select("+password")
            .populate("role");

        if (!user || !user.password) {
            throw new ApiError(
                401,
                "Invalid email or password."
            );
        }

        // Compare password
        const isPasswordValid =
            await PasswordService.compare(
                password,
                user.password
            );

        if (!isPasswordValid) {
            throw new ApiError(
                401,
                "Invalid email or password."
            );
        }

        // Account deleted
        if (user.isDeleted) {
            throw new ApiError(
                403,
                "This account no longer exists."
            );
        }

        // Account disabled
        if (user.status !== "active") {
            throw new ApiError(
                403,
                "Your account has been disabled."
            );
        }

        if (!user.emailVerified && !user.isEmailVerified) {
            throw new ApiError(
                403,
                "Please verify your email first."
            );
        }

        // Extract Role ID
        const roleId =
            typeof user.role === "object" &&
                user.role !== null &&
                "_id" in user.role
                ? user.role._id.toString()
                : String(user.role);

        // JWT Payload
        const payload = {
            sub: user._id.toString(),
            userId: user._id.toString(),
            email: user.email,
            role: roleId,
        };

        // Generate Tokens
        const accessToken =
            JwtService.signAccessToken(payload);

        const refreshToken =
            JwtService.signRefreshToken(payload);

        // Store Hashed Refresh Token
        const hashedRefreshToken =
            await PasswordService.hash(refreshToken);

        const expiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        );

        await SessionRepository.create({
            user: user._id,
            refreshToken: hashedRefreshToken,
            expiresAt,
            isRevoked: false,

            // We'll populate these later when we
            // have access to request headers.
            userAgent: "",
            ipAddress: "",
        });

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        return {
            user,
            tokens: {
                accessToken,
                refreshToken,
            },
        };
    }

    async refresh(
        refreshToken: string
    ) {
        // 1. Verify JWT

        const payload =
            JwtService.verifyRefreshToken(
                refreshToken
            );

        // 2. Find user

        const user = await User.findById(
            payload.sub
        ).populate("role");

        if (!user) {
            throw new ApiError(
                401,
                "Invalid refresh token."
            );
        }

        // 3. Find all active sessions

        const sessions =
            await SessionRepository.find({
                user: user._id,
                isRevoked: false,
            });

        // 4. Match refresh token

        let matchedSession = null;

        for (const session of sessions) {
            const matched =
                await PasswordService.compare(
                    refreshToken,
                    session.refreshToken
                );

            if (matched) {
                matchedSession = session;
                break;
            }
        }

        if (!matchedSession) {
            throw new ApiError(
                401,
                "Refresh session not found."
            );
        }

        // 5. Generate new tokens

        const roleId =
            typeof user.role === "object" &&
                user.role !== null &&
                "_id" in user.role
                ? String(user.role._id)
                : String(user.role);

        const jwtPayload = {
            userId: user._id.toString(),
            sub: user._id.toString(),
            email: user.email,
            role: roleId,
        };

        const newAccessToken =
            JwtService.signAccessToken(
                jwtPayload
            );

        const newRefreshToken =
            JwtService.signRefreshToken(
                jwtPayload
            );

        // 6. Rotate refresh token

        matchedSession.refreshToken =
            await PasswordService.hash(
                newRefreshToken
            );

        matchedSession.expiresAt =
            JwtService.getExpiryDate(
                env.JWT_REFRESH_EXPIRES
            );

        await matchedSession.save();

        return {
            accessToken:
                newAccessToken,
            refreshToken:
                newRefreshToken,
        };
    }

    async logout(
        refreshToken: string
    ) {
        const sessions =
            await SessionRepository.find({
                isRevoked: false,
            });

        let matchedSession = null;

        for (const session of sessions) {
            const matched =
                await PasswordService.compare(
                    refreshToken,
                    session.refreshToken
                );

            if (matched) {
                matchedSession = session;
                break;
            }
        }

        if (!matchedSession) {
            throw new ApiError(
                401,
                "Session not found."
            );
        }

        matchedSession.isRevoked = true;

        await matchedSession.save();

        return true;
    }

    async forgotPassword(email: string) {
        const user = await User.findOne({
            email: email.toLowerCase(),
        });

        if (!user) {
            throw new ApiError(
                404,
                "User not found."
            );
        }

        // Plain token sent to the user
        const resetToken = ResetTokenService.generate();

        // Hashed token stored in DB
        const hashedToken = crypto.createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.passwordResetToken = hashedToken;

        user.passwordResetExpires =
            ResetTokenService.expiry();

        await user.save();

        return {
            resetToken,
            expiresAt: user.passwordResetExpires,
        };
    }

    async resetPassword(data: ResetPasswordInput) {
        const { token, password } = data;

        // Hash incoming token
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find user with matching token
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: {
                $gt: new Date(),
            },
        });

        if (!user) {
            throw new ApiError(
                400,
                "Invalid or expired reset token."
            );
        }

        // Hash new password
        user.password =
            await PasswordService.hash(password);

        // Remove reset token
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        // Save user
        await user.save();

        // Revoke every active session
        await SessionRepository.updateMany(
            {
                user: user._id,
                isRevoked: false,
            },
            {
                isRevoked: true,
                lastUsedAt: new Date(),
            }
        );

        return true;
    }

    async changePassword(
        userId: string,
        data: ChangePasswordInput
    ) {
        const {
            currentPassword,
            newPassword,
        } = data;

        // Find user
        const user = await User.findById(userId)
            .select("+password");

        if (!user || !user.password) {
            throw new ApiError(
                404,
                "User not found."
            );
        }

        // Verify current password
        const isCurrentPasswordValid =
            await PasswordService.compare(
                currentPassword,
                user.password
            );

        if (!isCurrentPasswordValid) {
            throw new ApiError(
                400,
                "Current password is incorrect."
            );
        }

        // Prevent reusing the same password
        const isSamePassword =
            await PasswordService.compare(
                newPassword,
                user.password
            );

        if (isSamePassword) {
            throw new ApiError(
                400,
                "New password must be different from the current password."
            );
        }

        // Hash and save new password
        user.password =
            await PasswordService.hash(
                newPassword
            );

        // Clear any outstanding reset tokens
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();

        // Revoke every active session
        await SessionRepository.updateMany(
            {
                user: user._id,
                isRevoked: false,
            },
            {
                isRevoked: true,
                lastUsedAt: new Date(),
            }
        );

        return true;
    }

    async verifyEmail(token: string) {

        // Hash incoming token
        const hashedToken =
            ResetTokenService.hash(token);

        // Find matching user
        const user = await User.findOne({
            emailVerificationToken: hashedToken,
        });

        if (!user) {
            throw new ApiError(
                400,
                "Invalid or expired verification token."
            );
        }

        if (user.emailVerified) {
            throw new ApiError(
                400,
                "Email is already verified."
            );
        }

        // Verify email
        user.emailVerified = true;

        clearEmailVerificationFields(user);

        await user.save();

        return true;
    }

    async resendVerificationEmail(email: string) {
        const user = await User.findOne({
            email: email.toLowerCase(),
        });

        if (!user) {
            throw new ApiError(
                404,
                "User not found."
            );
        }

        if (user.emailVerified) {
            throw new ApiError(
                400,
                "Email already verified."
            );
        }

        const verificationToken =
            ResetTokenService.generate();

        user.emailVerificationToken =
            ResetTokenService.hash(
                verificationToken
            );

        user.emailVerificationExpires =
            ResetTokenService.expiry();

        await user.save();

        return {
            verificationToken,
            expiresAt:
                user.emailVerificationExpires,
        };
    }

}

export default new AuthService();