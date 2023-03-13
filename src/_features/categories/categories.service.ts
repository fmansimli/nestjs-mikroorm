import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

import { QueryCategoryDto, createCategoryDto } from './dtos';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private repo: EntityRepository<Category>) {}

  async find(query?: QueryCategoryDto) {
    const { fields, populate } = query || {};

    const ctgs = await this.repo.findAll({
      orderBy: { id: 'DESC' },
      populate: populate as any,
      fields: fields as any,
    });
    return ctgs;
  }

  async findById(id: number, _query?: QueryCategoryDto) {
    const { fields, populate } = _query || {};
    const ctg = await this.repo.findOne(
      { id },
      {
        populate: populate as any,
        fields: fields as any,
      },
    );
    return ctg;
  }

  async create(category: createCategoryDto) {
    const newCategory = this.repo.create(category);
    await this.repo.persistAndFlush(newCategory);
    return newCategory;
  }

  async update(id: number, attrs: any) {
    const category = await this.repo.findOne({ id });
    if (!category) return null;

    this.repo.assign(category, attrs);
    this.repo.flush();
    return category;
  }

  async deleteById(id: number) {
    const category = await this.repo.findOne({ id });
    if (!category) return null;

    category.locales.removeAll();
    this.repo.remove(category);
    await this.repo.flush();
    return category;
  }
}
