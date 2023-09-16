import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { TagsRepository } from './tags.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { Tag } from 'src/entities/tag';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Tag])],
  controllers: [TagsController],
  providers: [TagsService, TagsRepository],
})
export class TagsModule {}
