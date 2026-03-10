import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';

export abstract class BaseRepository<T extends ObjectLiteral> {
  protected readonly repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async findById(id: string, options?: FindOneOptions<T>): Promise<T | null> {
    return await this.repository.findOne({
      ...options,
      where: { id } as unknown as FindOptionsWhere<T>,
    });
  }

  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return await this.repository.findOne(options);
  }

  async findMany(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);

    return await this.repository.save(entity);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T> {
    await this.repository.update(id, data as never);

    const updated = await this.findById(id);

    if (!updated) {
      throw new Error(`Entity with id ${id} not found after update`);
    }

    return updated;
  }

  async save(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }

  async delete(where: FindOptionsWhere<T>): Promise<void> {
    await this.repository.delete(where);
  }

  createQueryBuilder(alias: string): ReturnType<Repository<T>['createQueryBuilder']> {
    return this.repository.createQueryBuilder(alias);
  }
}
