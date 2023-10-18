import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // swagger
  const config = new DocumentBuilder()
    .setTitle('nest jangduLog API docs')
    .setDescription('jangduLog(BlogProject) 개인 블로그 ')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.enableCors({
    origin: [
      'https://jangdu.site',
      'https://blog.jangdu.site',
      'https://blog.jangdu.me',
      'http://localhost:3000',
      'http://jangdu.site-front.s3-website.ap-northeast-2.amazonaws.com/',
    ],
    credentials: true,
  });

  const port = process.env.PORT || 3000;

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);

  console.log(`listening on port ${port}`);
  console.log('****', process.env.NODE_ENV);
}
bootstrap();
