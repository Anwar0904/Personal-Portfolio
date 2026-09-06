import { SortOrder } from "mongoose";

import { FAQ } from "@/models/faq.model";

import { IFAQManagement } from "@/types/faq.types";

class FAQRepository {
    async create(
        data: Partial<IFAQManagement>
    ) {
        return FAQ.create(data);
    }

    async findById(id: string) {
        return FAQ.findById(id)
            .populate(
                "createdBy",
                "name email"
            )
            .populate(
                "updatedBy",
                "name email"
            );
    }

    async getFAQs(
        filter: Record<string, unknown>,
        page: number,
        limit: number,
        sort: Record<string, SortOrder>
    ) {
        return FAQ.find(filter)
            .populate(
                "createdBy",
                "name email"
            )
            .populate(
                "updatedBy",
                "name email"
            )
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);
    }

    async countFAQs(
        filter: Record<string, unknown>
    ) {
        return FAQ.countDocuments(filter);
    }

    async update(
        id: string,
        data: Partial<IFAQManagement>
    ) {
        return FAQ.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true,
            }
        );
    }
}

const faqRepository = new FAQRepository();

export default faqRepository;
