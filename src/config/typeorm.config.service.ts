import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { Tag } from 'src/entities/tag';
import { Post_Tag } from 'src/entities/post_tag.entity';
import { Post } from 'src/entities/post.entity';
import { Comment } from 'src/entities/comment.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      username: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
      entities: [Post, Tag, Post_Tag, Comment],
      logging: true,
      synchronize: false,
      extra: {
        ssl: { rejectUnauthorized: false },
      },
    };
  }
}
