import { Injectable } from '@nestjs/common';
import { Tag } from 'src/entities/tag';

import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TagsRepository extends Repository<Tag> {
  constructor(private datasource: DataSource) {
    super(Tag, datasource.createEntityManager());
  }
}
