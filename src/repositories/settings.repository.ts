import { Settings } from "@/models/settings.model";

import { ISettings } from "@/types/settings.types";

class SettingsRepository {
    async getSettings() {
        return Settings.findOne({
            isDeleted: false,
        })
            .populate(
                "branding.logo branding.favicon createdBy updatedBy"
            );
    }

    async create(
        data: Partial<ISettings>
    ) {
        return Settings.create(
            data
        );
    }

    async update(
        data: Partial<ISettings>
    ) {
        return Settings.findOneAndUpdate(
            {
                isDeleted: false,
            },
            {
                $set: data,
            },
            {
                new: true,
                runValidators: true,
            }
        )
            .populate(
                "branding.logo branding.favicon createdBy updatedBy"
            );
    }
}

export default new SettingsRepository();