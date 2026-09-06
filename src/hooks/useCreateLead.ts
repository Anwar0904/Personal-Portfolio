"use client";

import { useMutation } from "@tanstack/react-query";

import {
    createLead,
    CreateLeadPayload,
} from "@/services/lead.client";

export function useCreateLead() {
    return useMutation({
        mutationFn: createLead,
    });
}