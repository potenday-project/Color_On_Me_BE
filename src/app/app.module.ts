import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../domain/user/user.module';
import { PersonalColorModule } from '../domain/personal-color/personal-color.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/domain/auth/auth.module';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/local-color-on-me'),
        AuthModule,
        ConfigModule,
        UserModule,
        PersonalColorModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
