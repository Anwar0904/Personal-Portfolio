import crypto from "crypto";

export class ResetTokenService {
    static generate() {
        return crypto.randomBytes(32).toString("hex");
    }

    static hash(token: string) {
        return crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");
    }
    static expiry() {
        return new Date(Date.now() + 1000 * 60 * 15);
    }
}