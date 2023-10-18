import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import {
  CreatePostRequestDto,
  UpdatePostRequestDto,
} from './dto/post.request.dto';
import { Post as PostEntity } from 'src/entities/post.entity';
import { GetPostsDto } from './dto/post.response.dto';
import { postIdParamDto } from 'src/dto/post.id.param.dto';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  const mockPosts: PostEntity[] = [
    {
      id: 1, // Replace with the actual ID
      title: '첫번째 포스트이름',
      content: '포스트 글',
      imgUrl: 'url',
      post_tag: [], // You can add mock data for related entities like post_tag and comment if needed
      comment: [],
      createdAt: new Date(), // Replace with the actual createdAt date
      updatedAt: new Date(), // Replace with the actual updatedAt date
    },
    {
      id: 2, // Replace with the actual ID
      title: '두번째 포스트이름',
      content: '두 번째 포스트 글',
      imgUrl: 'another_url',
      post_tag: [],
      comment: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Add more mock posts as needed
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [PostsService],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of posts', async () => {
      const result: PostEntity[] = mockPosts;
      jest.spyOn(service, 'getByPageAndTag').mockResolvedValue(result);

      const query = { tagId: '1' }; // Your query parameters
      expect(await controller.getAll(query)).toBe(result);
    });
  });

  describe('getById', () => {
    it('should return a single post by ID', async () => {
      const result: GetPostsDto = {
        post: mockPosts,
        views: 1,
      };
      jest.spyOn(service, 'getById').mockResolvedValue(result);

      const postId = 1;
      const param: postIdParamDto = { postId };
      expect(await controller.getById(param)).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const result = 'Post created successfully'; // Your expected result
      const body: CreatePostRequestDto = {
        title: 'title',
        content: 'content',
        imgUrl: 'imgUrl',
        tagList: ['javascript', 'typescript'],
      };
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(body)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update an existing post', async () => {
      const result = 'Post updated successfully'; // Your expected result
      const param: postIdParamDto = { postId: 1 };
      const body: UpdatePostRequestDto = {
        title: 'title',
        content: 'content',
        imgUrl: 'imgUrl',
      };
      jest.spyOn(service, 'updatePost').mockResolvedValue(result);

      expect(await controller.update(param, body)).toBe(result);
    });
  });

  describe('delete', () => {
    it('should delete an existing post', async () => {
      const result = 'Post deleted successfully'; // Your expected result
      const param: postIdParamDto = { postId: 1 };
      jest.spyOn(service, 'deletePost').mockResolvedValue(result);

      expect(await controller.delete(param)).toBe(result);
    });
  });
});
