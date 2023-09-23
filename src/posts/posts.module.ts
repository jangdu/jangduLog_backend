import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';
import { Post } from 'src/entities/post.entity';
import { Comment } from 'src/entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from 'src/entities/tag.entity';
import { TagsRepository } from 'src/tags/tags.repository';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Comment, Tag]), RedisModule],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, TagsRepository],
})
export class PostsModule {}
