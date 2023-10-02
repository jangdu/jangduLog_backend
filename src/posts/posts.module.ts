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
import { RanksController } from './rank.controller';
import { Post_Tag } from 'src/entities/post_tag.entity';
import { Post_TagsRepository } from './post_tag.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Comment, Tag, Post_Tag]),
    RedisModule,
  ],
  controllers: [PostsController, RanksController],
  providers: [
    PostsService,
    PostsRepository,
    TagsRepository,
    Post_TagsRepository,
  ],
})
export class PostsModule {}
