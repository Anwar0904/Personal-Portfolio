import {
  SortOrder,
  Types,
} from "mongoose";

import { User } from "@/models/user.model";
import { IUser } from "@/types/user.types";

class UserRepository {
  async findById(id: string) {
    return User.findById(id)
      .select(
        "-password " +
        "-passwordResetToken " +
        "-passwordResetExpires " +
        "-emailVerificationToken " +
        "-emailVerificationExpires"
      )
      .populate(
        "role",
        "name description permissions status"
      )
      .populate(
        "createdBy",
        "firstName lastName email"
      )
      .populate(
        "updatedBy",
        "firstName lastName email"
      );
  }

  async findByIdWithPassword(id: string) {
    return User.findById(id)
      .select("+password")
      .populate("role");
  }

  async findByEmail(email: string) {
    return User.findOne({
      email: email.toLowerCase(),
      isDeleted: false,
    });
  }

  async emailExists(
    email: string,
    excludeId?: string
  ) {
    const filter: Record<
      string,
      unknown
    > = {
      email: email.toLowerCase(),
      isDeleted: false,
    };

    if (
      excludeId &&
      Types.ObjectId.isValid(excludeId)
    ) {
      filter._id = {
        $ne: new Types.ObjectId(
          excludeId
        ),
      };
    }

    return User.exists(filter);
  }

  async create(
    data: Partial<IUser>
  ) {
    return User.create(data);
  }

  async findMany(
    filter: Record<string, unknown>,
    page: number,
    limit: number,
    sort: Record<string, SortOrder>
  ) {
    return User.find(filter)
      .select(
        "-password " +
        "-passwordResetToken " +
        "-passwordResetExpires " +
        "-emailVerificationToken " +
        "-emailVerificationExpires"
      )
      .populate(
        "role",
        "name description permissions status"
      )
      .sort(sort)
      .skip(
        (page - 1) * limit
      )
      .limit(limit)
      .lean();
  }

  async count(
    filter: Record<string, unknown>
  ) {
    return User.countDocuments(filter);
  }

  async update(
    id: string,
    data: Partial<IUser>
  ) {
    return User.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    )
      .select(
        "-password " +
        "-passwordResetToken " +
        "-passwordResetExpires " +
        "-emailVerificationToken " +
        "-emailVerificationExpires"
      )
      .populate(
        "role",
        "name description permissions status"
      );
  }

  async softDelete(id: string) {
    return User.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      {
        new: true,
      }
    );
  }

  async restore(id: string) {
    return User.findByIdAndUpdate(
      id,
      {
        isDeleted: false,
        deletedAt: null,
      },
      {
        new: true,
      }
    );
  }
}

export default new UserRepository();