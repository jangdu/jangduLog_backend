import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // swagger
  const config = new DocumentBuilder()
    .setTitle('nest showReservation API')
    .setDescription('공연 예매 사이트 API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.enableCors({
    origin: ['https://jangdu.site', 'http://localhost:3000'],
    credentials: true, // 요청에 쿠키 정보를 함께 보냄
  });

  const port = process.env.PORT || 3000;

  // class validator 전역 적용
  app.useGlobalPipes(new ValidationPipe());
  // // httpExceptionfilter활성화 예외처리 전역 필터 설정
  // app.useGlobalFilters(new HttpExceptionFilter());
  // cors 설정

  await app.listen(port);

  console.log(`listening on port ${port}`);
  console.log('****', process.env.NODE_ENV);
}
bootstrap();
