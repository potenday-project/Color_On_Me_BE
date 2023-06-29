import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Color On Me API Docs')
        .setDescription('컬러온미 API 문서 입니다!')
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);

    app.enableCors({
        origin: ['https://color-on-me-fe.vercel.app/'],
        credentials: true,
    });

    await app.listen(8080);
}
bootstrap();
