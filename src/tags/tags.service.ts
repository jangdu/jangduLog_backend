import { Injectable } from '@nestjs/common';
import { TagsRepository } from './tags.repository';
import { Tag } from 'src/entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(private tagsRepository: TagsRepository) {}

  async findOrCreateTag(name: string): Promise<Tag> {
    // 이름으로 태그를 찾거나 생성합니다.
    let tag = await this.tagsRepository.findByName(name);

    if (!tag) {
      tag = this.tagsRepository.create({ name });
      await this.tagsRepository.save(tag);
    }

    return tag;
  }
}
