import { UserStatus } from "@/enums";

export interface UserQuery {
    page?: number;

    limit?: number;

    search?: string;

    role?: string;

    status?: UserStatus;

    verified?: boolean;

    includeDeleted?: boolean;

    sort?: string;
}

export interface CreateUserInput {
    firstName: string;

    lastName?: string;

    email: string;

    password: string;

    role: string;

    status?: UserStatus;

    phone?: string;

    jobTitle?: string;

    avatar?: string | null;

    isEmailVerified?: boolean;
}

export interface UpdateUserInput {
    firstName?: string;

    lastName?: string;

    email?: string;

    role?: string;

    status?: UserStatus;

    phone?: string | null;

    jobTitle?: string | null;

    avatar?: string | null;

    isEmailVerified?: boolean;
}

export interface UserListItem {
    _id: string;

    firstName: string;

    lastName?: string;

    email: string;

    avatar?: string | null;

    phone?: string | null;

    jobTitle?: string | null;

    role: {
        _id: string;

        name: string;
    } | null;

    status: UserStatus;

    isEmailVerified: boolean;

    lastLogin?: Date | null;

    createdAt: Date;

    updatedAt: Date;

    isDeleted: boolean;
}