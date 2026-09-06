import { Types } from "mongoose";

import { ApiError } from "@/lib/api/api-error";

import ConsultationRepository from "@/repositories/consultation.repository";

import {
    CONSULTATION_STATUS,
    ConsultationType,
} from "@/enums";

import {
    CreateConsultationInput,
    UpdateConsultationInput,
    ConsultationQuery,
} from "@/validators/consultation.validator";

class ConsultationService {
    async getConsultations(
        query: ConsultationQuery
    ) {
        const page = Number(
            query.page ?? 1
        );

        const limit = Number(
            query.limit ?? 10
        );

        const filter: Record<
            string,
            unknown
        > = {
            isDeleted: false,
        };

        if (query.lead) {
            filter.lead =
                new Types.ObjectId(
                    query.lead
                );
        }

        if (query.assignedTo) {
            filter.assignedTo =
                new Types.ObjectId(
                    query.assignedTo
                );
        }

        if (query.status) {
            filter.status =
                query.status;
        }

        if (query.meetingType) {
            filter.meetingType =
                query.meetingType;
        }

        if (query.from || query.to) {
            const scheduledAt: Record<
                string,
                Date
            > = {};

            if (query.from) {
                scheduledAt.$gte =
                    new Date(query.from);
            }

            if (query.to) {
                scheduledAt.$lte =
                    new Date(query.to);
            }

            filter.scheduledAt =
                scheduledAt;
        }

        /*
         * Search is intentionally handled
         * against fields available directly
         * on Consultation.
         *
         * Lead-name/email searching can be
         * added later with aggregation if
         * needed by the admin UI.
         */
        if (query.search) {
            filter.$text = {
                $search: query.search,
            };
        }

        let sort: Record<
            string,
            1 | -1
        > = {
            scheduledAt: -1,
        };

        if (query.sort) {
            const field =
                query.sort.startsWith("-")
                    ? query.sort.slice(1)
                    : query.sort;

            const direction =
                query.sort.startsWith("-")
                    ? -1
                    : 1;

            const allowedSortFields = [
                "scheduledAt",
                "createdAt",
                "updatedAt",
                "duration",
                "status",
            ];

            if (
                allowedSortFields.includes(
                    field
                )
            ) {
                sort = {
                    [field]: direction,
                };
            }
        }

        const [
            consultations,
            total,
        ] = await Promise.all([
            ConsultationRepository.findMany(
                filter,
                page,
                limit,
                sort
            ),

            ConsultationRepository.count(
                filter
            ),
        ]);

        return {
            consultations,

            pagination: {
                page,
                limit,
                total,
                totalPages:
                    Math.ceil(
                        total / limit
                    ),
            },
        };
    }

    async getConsultationById(
        id: string
    ) {
        if (
            !Types.ObjectId.isValid(id)
        ) {
            throw new ApiError(
                400,
                "Invalid consultation ID."
            );
        }

        const consultation =
            await ConsultationRepository.findById(
                id
            );

        if (!consultation) {
            throw new ApiError(
                404,
                "Consultation not found."
            );
        }

        return consultation;
    }

    async createConsultation(
        data: CreateConsultationInput,
        userId: string
    ) {
        if (
            !Types.ObjectId.isValid(
                data.lead
            )
        ) {
            throw new ApiError(
                400,
                "Invalid lead ID."
            );
        }

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

        const scheduledAt =
            new Date(
                data.scheduledAt
            );

        if (
            Number.isNaN(
                scheduledAt.getTime()
            )
        ) {
            throw new ApiError(
                400,
                "Invalid consultation date."
            );
        }

        if (
            scheduledAt <= new Date()
        ) {
            throw new ApiError(
                400,
                "Consultation must be scheduled for a future date."
            );
        }

        const status =
            data.status ??
            CONSULTATION_STATUS.SCHEDULED;

        return ConsultationRepository.create(
            {
                lead:
                    new Types.ObjectId(
                        data.lead
                    ),

                assignedTo:
                    data.assignedTo
                        ? new Types.ObjectId(
                            data.assignedTo
                        )
                        : null,

                scheduledAt,

                duration:
                    data.duration,

                meetingType:
                    data.meetingType,

                meetingLink:
                    data.meetingLink ??
                    "",

                location:
                    data.location ??
                    "",

                agenda:
                    data.agenda ??
                    "",

                notes:
                    (data.notes ?? []).map(
                        (note) => ({
                            note: note.note,
                            createdBy: note.createdBy
                                ? new Types.ObjectId(
                                    note.createdBy
                                )
                                : null,
                            createdAt:
                                note.createdAt ??
                                new Date(),
                        })
                    ),

                status,

                createdBy:
                    new Types.ObjectId(
                        userId
                    ),

                updatedBy:
                    new Types.ObjectId(
                        userId
                    ),

                isDeleted: false,

                deletedAt: null,
            }
        );
    }

    async updateConsultation(
        id: string,
        data: UpdateConsultationInput,
        userId: string
    ) {
        if (
            !Types.ObjectId.isValid(id)
        ) {
            throw new ApiError(
                400,
                "Invalid consultation ID."
            );
        }

        const consultation =
            await ConsultationRepository.findById(
                id
            );

        if (!consultation) {
            throw new ApiError(
                404,
                "Consultation not found."
            );
        }

        if (data.lead) {
            if (
                !Types.ObjectId.isValid(
                    data.lead
                )
            ) {
                throw new ApiError(
                    400,
                    "Invalid lead ID."
                );
            }

            consultation.lead =
                new Types.ObjectId(
                    data.lead
                );
        }

        if (
            data.assignedTo !==
            undefined
        ) {
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

            consultation.assignedTo =
                data.assignedTo
                    ? new Types.ObjectId(
                        data.assignedTo
                    )
                    : null;
        }

        if (
            data.scheduledAt
        ) {
            const scheduledAt =
                new Date(
                    data.scheduledAt
                );

            if (
                Number.isNaN(
                    scheduledAt.getTime()
                )
            ) {
                throw new ApiError(
                    400,
                    "Invalid consultation date."
                );
            }

            if (
                scheduledAt <= new Date() &&
                consultation.status ===
                CONSULTATION_STATUS.SCHEDULED
            ) {
                throw new ApiError(
                    400,
                    "Scheduled consultation must be in the future."
                );
            }

            consultation.scheduledAt =
                scheduledAt;
        }

        if (
            data.duration !==
            undefined
        ) {
            consultation.duration =
                data.duration;
        }

        if (
            data.meetingType
        ) {
            consultation.meetingType =
                data.meetingType;
        }

        if (
            data.meetingLink !==
            undefined
        ) {
            consultation.meetingLink =
                data.meetingLink;
        }

        if (
            data.location !==
            undefined
        ) {
            consultation.location =
                data.location;
        }

        if (
            data.agenda !==
            undefined
        ) {
            consultation.agenda =
                data.agenda;
        }

        if (
            data.status !==
            undefined
        ) {
            consultation.status =
                data.status;

            /*
             * A completed/cancelled consultation
             * no longer needs to satisfy the
             * future-date requirement.
             */
        }

        consultation.updatedBy =
            new Types.ObjectId(
                userId
            );

        await consultation.save();

        return ConsultationRepository.findById(
            id
        );
    }

    async deleteConsultation(
        id: string
    ) {
        if (
            !Types.ObjectId.isValid(id)
        ) {
            throw new ApiError(
                400,
                "Invalid consultation ID."
            );
        }

        const consultation =
            await ConsultationRepository.findById(
                id
            );

        if (!consultation) {
            throw new ApiError(
                404,
                "Consultation not found."
            );
        }

        const deleted =
            await ConsultationRepository.softDelete(
                id
            );

        if (!deleted) {
            throw new ApiError(
                404,
                "Consultation not found."
            );
        }

        return true;
    }

    async getUpcomingConsultations() {
        return ConsultationRepository.upcoming();
    }

    async getCompletedConsultations() {
        return ConsultationRepository.findMany(
            {
                status:
                    CONSULTATION_STATUS.COMPLETED,
                isDeleted: false,
            },
            1,
            100,
            {
                scheduledAt: -1,
            }
        );
    }

    async getConsultationsByLead(
        leadId: string
    ) {
        if (
            !Types.ObjectId.isValid(
                leadId
            )
        ) {
            throw new ApiError(
                400,
                "Invalid lead ID."
            );
        }

        return ConsultationRepository.byLead(
            new Types.ObjectId(
                leadId
            )
        );
    }

    async changeStatus(
        id: string,
        status: ConsultationType,
        userId: string
    ) {
        if (
            !Types.ObjectId.isValid(id)
        ) {
            throw new ApiError(
                400,
                "Invalid consultation ID."
            );
        }

        const consultation =
            await ConsultationRepository.findById(
                id
            );

        if (!consultation) {
            throw new ApiError(
                404,
                "Consultation not found."
            );
        }

        consultation.status = status;

        consultation.updatedBy =
            new Types.ObjectId(
                userId
            );

        await consultation.save();

        return ConsultationRepository.findById(
            id
        );
    }

    async assignConsultation(
        id: string,
        assignedTo: string | null,
        userId: string
    ) {
        if (
            !Types.ObjectId.isValid(id)
        ) {
            throw new ApiError(
                400,
                "Invalid consultation ID."
            );
        }

        if (
            assignedTo &&
            !Types.ObjectId.isValid(
                assignedTo
            )
        ) {
            throw new ApiError(
                400,
                "Invalid user ID."
            );
        }

        const consultation =
            await ConsultationRepository.findById(
                id
            );

        if (!consultation) {
            throw new ApiError(
                404,
                "Consultation not found."
            );
        }

        consultation.assignedTo =
            assignedTo
                ? new Types.ObjectId(
                    assignedTo
                )
                : null;

        consultation.updatedBy =
            new Types.ObjectId(
                userId
            );

        await consultation.save();

        return ConsultationRepository.findById(
            id
        );
    }

    async addNote(
        id: string,
        content: string,
        userId: string
    ) {
        if (
            !Types.ObjectId.isValid(id)
        ) {
            throw new ApiError(
                400,
                "Invalid consultation ID."
            );
        }

        const trimmed =
            content.trim();

        if (!trimmed) {
            throw new ApiError(
                400,
                "Note cannot be empty."
            );
        }

        if (trimmed.length > 5000) {
            throw new ApiError(
                400,
                "Note cannot exceed 5000 characters."
            );
        }

        const consultation =
            await ConsultationRepository.findById(
                id
            );

        if (!consultation) {
            throw new ApiError(
                404,
                "Consultation not found."
            );
        }

        consultation.notes.push({
            note: trimmed,

            createdBy:
                new Types.ObjectId(
                    userId
                ),

            createdAt: new Date(),
        });

        consultation.updatedBy =
            new Types.ObjectId(
                userId
            );

        await consultation.save();

        return ConsultationRepository.findById(
            id
        );
    }
}

export default new ConsultationService();