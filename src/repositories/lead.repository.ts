import { SortOrder, Types } from "mongoose";

import { Lead } from "@/models/lead.model";
import { ILead } from "@/types/lead.types";

class LeadRepository {
    async create(data: Partial<ILead>) {
        return Lead.create(data);
    }

    async findById(id: string) {
        return Lead.findById(id)
            .populate("interestedServices")
            .populate("assignedTo")
            .populate("createdBy")
            .populate("updatedBy");
    }

    async findByEmail(email: string) {
        return Lead.findOne({
            email: email.trim().toLowerCase(),
        });
    }

    async getLeads(
        filter: Record<string, unknown>,
        page: number,
        limit: number,
        sort: Record<string, SortOrder>
    ) {
        return Lead.find(filter)
            .populate("interestedServices")
            .populate("assignedTo")
            .populate("createdBy")
            .populate("updatedBy")
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();
    }

    async countLeads(filter: Record<string, unknown>) {
        return Lead.countDocuments(filter);
    }

    async update(id: string, data: Partial<ILead>) {
        return Lead.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        })
            .populate("interestedServices")
            .populate("assignedTo")
            .populate("createdBy")
            .populate("updatedBy");
    }

    async delete(id: string) {
        return Lead.findByIdAndDelete(id);
    }

    async assignLead(id: string, userId: Types.ObjectId) {
        return Lead.findByIdAndUpdate(
            id,
            {
                assignedTo: userId,
            },
            {
                new: true,
                runValidators: true,
            }
        )
            .populate("assignedTo")
            .populate("interestedServices");
    }

    async updateStatus(id: string, status: string) {
        return Lead.findByIdAndUpdate(
            id,
            {
                status,
            },
            {
                new: true,
                runValidators: true,
            }
        )
            .populate("assignedTo")
            .populate("interestedServices");
    }

    async markContacted(id: string) {
        return Lead.findByIdAndUpdate(
            id,
            {
                contactedAt: new Date(),
            },
            {
                new: true,
                runValidators: true,
            }
        )
            .populate("assignedTo")
            .populate("interestedServices");
    }
}

export default new LeadRepository();