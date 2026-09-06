import { Model, Types, UpdateQuery } from "mongoose";

export abstract class BaseRepository<T> {
  constructor(protected readonly model: Model<any>) { }

  async create(data: Partial<T>) {
    return this.model.create(data);
  }

  async findById(id: string | Types.ObjectId) {
    return this.model.findById(id);
  }

  async findOne(filter: Record<string, unknown>) {
    return this.model.findOne(filter);
  }

  async findMany(filter: Record<string, unknown> = {}) {
    return this.model.find(filter);
  }

  async updateById(
    id: string | Types.ObjectId,
    data: UpdateQuery<T>
  ) {
    return this.model.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async deleteById(id: string | Types.ObjectId) {
    return this.model.findByIdAndDelete(id);
  }

  async exists(filter: Record<string, unknown>) {
    return !!(await this.model.exists(filter));
  }

  async count(filter: Record<string, unknown> = {}) {
    return this.model.countDocuments(filter);
  }
}