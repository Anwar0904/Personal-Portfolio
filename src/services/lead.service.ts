import { Types } from "mongoose";

import LeadRepository from "@/repositories/lead.repository";

import { ApiError } from "@/lib/api/api-error";

import {
    LEAD_SOURCE,
    LEAD_STATUS,
    LeadStatus,
} from "@/enums";

import {
    CreateLeadInput,
    UpdateLeadInput,
    LeadQuery,
} from "@/types/lead-management";

class LeadService {
    async getLeads(query: LeadQuery) {
        const page = Math.max(
            1,
            Number(query.page ?? 1)
        );

        const limit = Math.min(
            100,
            Math.max(
                1,
                Number(query.limit ?? 10)
            )
        );

        const filter: Record<string, unknown> = {
            isDeleted: false,
        };

        if (query.search?.trim()) {
            const search = query.search.trim();

            filter.$or = [
                {
                    fullName: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    email: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    company: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    phone: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    projectTitle: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        if (query.status) {
            filter.status = query.status;
        }

        if (query.source) {
            filter.source = query.source;
        }

        if (query.assignedTo) {
            if (!Types.ObjectId.isValid(query.assignedTo)) {
                throw new ApiError(
                    400,
                    "Invalid assigned user ID."
                );
            }

            filter.assignedTo =
                new Types.ObjectId(query.assignedTo);
        }

        let sort: Record<string, 1 | -1> = {
            createdAt: -1,
        };

        if (query.sort?.trim()) {
            const rawField = query.sort.trim();

            const descending =
                rawField.startsWith("-");

            const field = rawField.replace(
                /^-/,
                ""
            );

            const allowedSortFields = [
                "createdAt",
                "updatedAt",
                "fullName",
                "email",
                "status",
                "source",
                "company",
                "contactedAt",
            ];

            if (allowedSortFields.includes(field)) {
                sort = {
                    [field]: descending ? -1 : 1,
                };
            }
        }

        const [leads, total] = await Promise.all([
            LeadRepository.getLeads(
                filter,
                page,
                limit,
                sort
            ),
            LeadRepository.countLeads(filter),
        ]);

        return {
            leads,
            pagination: {
                page,
                limit,
                total,
                totalPages:
                    total === 0
                        ? 1
                        : Math.ceil(total / limit),
            },
        };
    }

    async getLeadById(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new ApiError(
                400,
                "Invalid lead ID."
            );
        }

        const lead =
            await LeadRepository.findById(id);

        if (!lead || lead.isDeleted) {
            throw new ApiError(
                404,
                "Lead not found."
            );
        }

        return lead;
    }

    async createLead(
        data: CreateLeadInput,
        userId?: string
    ) {
        const email =
            data.email.trim().toLowerCase();

        const existing =
            await LeadRepository.findByEmail(email);

        if (
            existing &&
            !existing.isDeleted
        ) {
            throw new ApiError(
                409,
                "A lead with this email already exists."
            );
        }

        const actorId =
            userId &&
                Types.ObjectId.isValid(userId)
                ? new Types.ObjectId(userId)
                : null;

        return LeadRepository.create({
            fullName: data.fullName.trim(),
            email,
            phone: data.phone?.trim(),
            company: data.company?.trim(),
            website: data.website?.trim(),

            projectTitle:
                data.projectTitle?.trim() ?? "",

            projectType:
                data.projectType?.trim() ?? "",

            timeline:
                data.timeline?.trim() ?? "",

            preferredContact:
                data.preferredContact ?? "email",

            attachments:
                data.attachments ?? [],

            message: data.message.trim(),

            budget:
                data.budget ?? null,

            notes:
                data.notes?.map((note) => ({
                    note: note.note.trim(),
                    createdAt:
                        note.createdAt ??
                        new Date(),
                    createdBy:
                        note.createdBy &&
                            Types.ObjectId.isValid(
                                note.createdBy
                            )
                            ? new Types.ObjectId(
                                note.createdBy
                            )
                            : null,
                })) ?? [],

            interestedServices:
                data.interestedServices.map(
                    (id) =>
                        new Types.ObjectId(id)
                ),

            assignedTo:
                data.assignedTo &&
                    Types.ObjectId.isValid(
                        data.assignedTo
                    )
                    ? new Types.ObjectId(
                        data.assignedTo
                    )
                    : null,

            source:
                data.source ??
                LEAD_SOURCE.WEBSITE,

            status:
                data.status ??
                LEAD_STATUS.NEW,

            createdBy: actorId,
            updatedBy: actorId,

            isDeleted: false,
            deletedAt: null,
        });
    }

    async updateLead(
        id: string,
        data: UpdateLeadInput,
        userId: string
    ) {
        if (!Types.ObjectId.isValid(id)) {
            throw new ApiError(
                400,
                "Invalid lead ID."
            );
        }

        if (!Types.ObjectId.isValid(userId)) {
            throw new ApiError(
                400,
                "Invalid user ID."
            );
        }

        const lead =
            await LeadRepository.findById(id);

        if (!lead || lead.isDeleted) {
            throw new ApiError(
                404,
                "Lead not found."
            );
        }

        if (data.email !== undefined) {
            const email =
                data.email
                    .trim()
                    .toLowerCase();

            const existing =
                await LeadRepository.findByEmail(
                    email
                );

            if (
                existing &&
                existing._id.toString() !== id &&
                !existing.isDeleted
            ) {
                throw new ApiError(
                    409,
                    "Another lead already uses this email."
                );
            }

            lead.email = email;
        }

        if (data.fullName !== undefined) {
            lead.fullName =
                data.fullName.trim();
        }

        if (data.phone !== undefined) {
            lead.phone =
                data.phone?.trim();
        }

        if (data.company !== undefined) {
            lead.company =
                data.company?.trim();
        }

        if (data.website !== undefined) {
            lead.website =
                data.website?.trim();
        }

        if (data.projectTitle !== undefined) {
            lead.projectTitle =
                data.projectTitle.trim();
        }

        if (data.projectType !== undefined) {
            lead.projectType =
                data.projectType.trim();
        }

        if (data.timeline !== undefined) {
            lead.timeline =
                data.timeline.trim();
        }

        if (
            data.preferredContact !==
            undefined
        ) {
            lead.preferredContact =
                data.preferredContact;
        }

        if (data.attachments !== undefined) {
            lead.attachments =
                data.attachments;
        }

        if (data.message !== undefined) {
            lead.message =
                data.message.trim();
        }

        if (data.budget !== undefined) {
            lead.budget =
                data.budget;
        }

        if (data.interestedServices !== undefined) {
            lead.interestedServices =
                data.interestedServices.map(
                    (serviceId) => {
                        if (
                            !Types.ObjectId.isValid(
                                serviceId
                            )
                        ) {
                            throw new ApiError(
                                400,
                                "Invalid interested service ID."
                            );
                        }

                        return new Types.ObjectId(
                            serviceId
                        );
                    }
                );
        }

        if (data.assignedTo !== undefined) {
            if (
                data.assignedTo &&
                !Types.ObjectId.isValid(
                    data.assignedTo
                )
            ) {
                throw new ApiError(
                    400,
                    "Invalid assigned user ID."
                );
            }

            lead.assignedTo =
                data.assignedTo
                    ? new Types.ObjectId(
                        data.assignedTo
                    )
                    : null;
        }

        if (data.source !== undefined) {
            lead.source = data.source;
        }

        if (data.status !== undefined) {
            lead.status = data.status;
        }

        lead.updatedBy =
            new Types.ObjectId(userId);

        await lead.save();

        return LeadRepository.findById(id);
    }

    async deleteLead(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new ApiError(
                400,
                "Invalid lead ID."
            );
        }

        const lead =
            await LeadRepository.findById(id);

        if (!lead) {
            throw new ApiError(
                404,
                "Lead not found."
            );
        }

        if (lead.isDeleted) {
            throw new ApiError(
                400,
                "Lead already deleted."
            );
        }

        lead.isDeleted = true;
        lead.deletedAt = new Date();

        await lead.save();

        return true;
    }

    async restoreLead(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new ApiError(
                400,
                "Invalid lead ID."
            );
        }

        const lead =
            await LeadRepository.findById(id);

        if (!lead) {
            throw new ApiError(
                404,
                "Lead not found."
            );
        }

        if (!lead.isDeleted) {
            throw new ApiError(
                400,
                "Lead is already active."
            );
        }

        lead.isDeleted = false;
        lead.deletedAt = null;

        await lead.save();

        return LeadRepository.findById(id);
    }

    async changeStatus(
        id: string,
        status: LeadStatus
    ) {
        if (!Types.ObjectId.isValid(id)) {
            throw new ApiError(
                400,
                "Invalid lead ID."
            );
        }

        const lead =
            await LeadRepository.findById(id);

        if (!lead || lead.isDeleted) {
            throw new ApiError(
                404,
                "Lead not found."
            );
        }

        lead.status = status;

        if (
            status ===
            LEAD_STATUS.CONVERTED
        ) {
            lead.convertedAt =
                lead.convertedAt ??
                new Date();
        }

        await lead.save();

        return LeadRepository.findById(id);
    }

    async assignLead(
        id: string,
        assignedTo: string
    ) {
        if (!Types.ObjectId.isValid(id)) {
            throw new ApiError(
                400,
                "Invalid lead ID."
            );
        }

        if (
            !Types.ObjectId.isValid(
                assignedTo
            )
        ) {
            throw new ApiError(
                400,
                "Invalid assigned user ID."
            );
        }

        const lead =
            await LeadRepository.findById(id);

        if (!lead || lead.isDeleted) {
            throw new ApiError(
                404,
                "Lead not found."
            );
        }

        return LeadRepository.assignLead(
            id,
            new Types.ObjectId(assignedTo)
        );
    }

    async markContacted(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new ApiError(
                400,
                "Invalid lead ID."
            );
        }

        const lead =
            await LeadRepository.findById(id);

        if (!lead || lead.isDeleted) {
            throw new ApiError(
                404,
                "Lead not found."
            );
        }

        lead.contactedAt =
            new Date();

        if (
            lead.status ===
            LEAD_STATUS.NEW
        ) {
            lead.status =
                LEAD_STATUS.CONTACTED;
        }

        await lead.save();

        return LeadRepository.findById(id);
    }
}

export default new LeadService();