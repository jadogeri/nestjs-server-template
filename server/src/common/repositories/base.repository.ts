    
// src/core/repositories/base.repository.ts
import { 
  Repository, 
  FindManyOptions, 
  FindOneOptions, 
  DeepPartial, 
  ObjectLiteral, 
  DeleteResult, 
} from 'typeorm';

export abstract class BaseRepository<T extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<T>) {}

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }

  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return await this.repository.findOne(options);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  // Change the 'data' type here
  async update(id: any, data: DeepPartial<T>): Promise<T | null> {
    const entityToUpdate = await this.repository.preload({
      id,
      ...data,
    }); // No assertion needed now

  if (!entityToUpdate) return null;

  return await this.repository.save(entityToUpdate);
}

  async delete(id: any): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}