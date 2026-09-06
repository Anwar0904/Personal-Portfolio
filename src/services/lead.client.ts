import axios from "axios";

export interface CreateLeadPayload {
    fullName: string;
    email: string;
    phone?: string;
    company?: string;
    website?: string;

    interestedServices: string[];

    budget?: {
        min?: number;
        max?: number;
        currency: string;
    } | null;

    message: string;
}

export async function createLead(
    payload: CreateLeadPayload
) {
    const { data } = await axios.post(
        "/api/leads",
        payload
    );

    return data;
}