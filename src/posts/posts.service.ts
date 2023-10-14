import { TagsRepository } from './../tags/tags.repository';
import {
  BadGatewayException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { Post } from 'src/entities/post.entity';
import { RedisClientType } from 'redis';
import { GetPostsDto } from './dto/post.response.dto';
import { Post_TagsRepository } from 'src/posts/post_tag.repository';
import { sendEmail } from 'src/email/email.service';

@Injectable()
export class PostsService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: RedisClientType,
    private postsRepository: PostsRepository,
    private post_tagsRepository: Post_TagsRepository,
  ) {}

  // GET AllPost
  async getByPageAndTag(tagId: number): Promise<Post[]> {
    const posts = await this.postsRepository.getByTag(tagId);

    if (!posts) {
      throw new NotFoundException('해당 포스트를 찾을 수 없습니다.');
    }

    return posts;
  }

  // GET ByPostId
  async getById(postId: number): Promise<GetPostsDto> {
    const post = await this.postsRepository.getById(postId);

    if (!post) {
      throw new NotFoundException('해당 포스트를 찾을 수 없습니다.');
    }

    const views = await this.incrementPostViews(postId);

    return { post, views };
  }

  // CREATE Post
  async create(
    title: string,
    content: string,
    imgUrl: string,
    tagList: string[],
  ): Promise<string> {
    const createPostMessage = await this.postsRepository.createPost(
      title,
      content,
      imgUrl,
      tagList,
    );

    const emailContent = `새로운 글이 게시되었습니다: ${title}`;
    sendEmail('jjd0324@gmail.com', '새로운 글 게시 알림', emailContent);

    return createPostMessage;
  }

  // 레디스 조회수 올려주기
  async incrementPostViews(postId: number): Promise<number> {
    const redisKey = `post:${postId}:views`;

    const currentViews = await this.redis.get(redisKey);

    const newViews = currentViews ? parseInt(currentViews) + 1 : 1;

    await this.redis.set(redisKey, newViews);

    return newViews;
  }

  // 모든 포스트 조회 수 키 가져오기
  async getPopularPosts(): Promise<Post[]> {
    const postIds = await this.redis.keys('post:*:views');

    // 조회 수가 높은 순으로 정렬
    postIds.sort((a, b) => {
      const viewsA = parseInt(a.split(':')[1]);
      const viewsB = parseInt(b.split(':')[1]);
      return viewsB - viewsA;
    });

    const popularPosts = await Promise.all(
      postIds.map(async (postId) => {
        const postIdNum = parseInt(postId.split(':')[1]);
        return await this.postsRepository.findOne({ where: { id: postIdNum } }); // 데이터베이스에서 포스트 정보 가져오기
      }),
    );

    return popularPosts;
  }

  // Update Posts
  async updatePost(
    id: number,
    title: string,
    content: string,
    imgUrl: string,
  ): Promise<string> {
    try {
      const updatedPost = await this.postsRepository.updatePost(
        id,
        title,
        content,
        imgUrl,
      );
      return '포스트가 업데이트되었습니다.';
    } catch (error) {
      throw new InternalServerErrorException('서버의 문제로 인해 실패');
    }
  }

  // Delete Posts
  async deletePost(id: number): Promise<string> {
    try {
      await this.post_tagsRepository.deleteByPostId(id);

      await this.postsRepository.deletePost(id);

      return '포스트가 삭제되었습니다.';
    } catch (error) {
      throw new InternalServerErrorException('서버의 문제로 인해 실패');
    }
  }
}
