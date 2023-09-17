import { Injectable } from '@nestjs/common';
import { Tag } from 'src/entities/tag.entity';

import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TagsRepository extends Repository<Tag> {
  constructor(private datasource: DataSource) {
    super(Tag, datasource.createEntityManager());
  }

  async findByName(name: string): Promise<Tag> {
    const tag = await this.findOne({ where: { name } });

    return tag;
  }

  async findOrCreateTag(name: string): Promise<Tag> {
    // 이름으로 태그를 찾거나 생성합니다.
    let tag = await this.findByName(name);

    if (!tag) {
      tag = await this.create({ name });
      await this.save(tag);
    }
    // console.log(tag);

    return tag;
  }
}
