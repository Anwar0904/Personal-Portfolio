import {
    SortOrder,
    Types,
} from "mongoose";

import { Consultation } from "@/models/consultation.model";
import { IConsultation } from "@/types/consultation.types";

class ConsultationRepository {
    async create(
        data: Partial<IConsultation>
    ) {
        return Consultation.create(data);
    }

    async findById(id: string) {
        return Consultation.findOne({
            _id: id,
            isDeleted: false,
        })
            .populate(
                "lead"
            )
            .populate(
                "assignedTo",
                "name email avatar"
            )
            .populate(
                "createdBy",
                "name email"
            )
            .populate(
                "updatedBy",
                "name email"
            );
    }

    async findMany(
        filter: Record<string, unknown>,
        page: number,
        limit: number,
        sort: Record<
            string,
            SortOrder
        >
    ) {
        return Consultation.find(
            filter
        )
            .populate(
                "lead"
            )
            .populate(
                "assignedTo",
                "name email avatar"
            )
            .sort(sort)
            .skip(
                (page - 1) * limit
            )
            .limit(limit);
    }

    async count(
        filter: Record<string, unknown>
    ) {
        return Consultation.countDocuments(
            filter
        );
    }

    async update(
        id: string,
        data: Partial<IConsultation>
    ) {
        return Consultation.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false,
            },
            data,
            {
                new: true,
                runValidators: true,
            }
        );
    }

    async softDelete(id: string) {
        return Consultation.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false,
            },
            {
                isDeleted: true,
                deletedAt: new Date(),
            },
            {
                new: true,
            }
        );
    }

    async byLead(
        lead: Types.ObjectId
    ) {
        return Consultation.find({
            lead,
            isDeleted: false,
        })
            .populate(
                "assignedTo",
                "name email avatar"
            )
            .sort({
                scheduledAt: -1,
            });
    }

    async upcoming() {
        return Consultation.find({
            scheduledAt: {
                $gte: new Date(),
            },
            status:
                "scheduled",
            isDeleted: false,
        })
            .populate("lead")
            .populate(
                "assignedTo",
                "name email avatar"
            )
            .sort({
                scheduledAt: 1,
            });
    }
}

export default new ConsultationRepository();