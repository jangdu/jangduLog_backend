import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { TagsRepository } from './tags.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { Tag } from 'src/entities/tag.entity';
import { Post_Tag } from 'src/entities/post_tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Tag, Post_Tag])],
  controllers: [TagsController],
  providers: [TagsService, TagsRepository],
})
export class TagsModule {}
