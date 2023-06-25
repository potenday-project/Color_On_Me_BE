import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../domain/user/user.module';

@Module({
    imports: [MongooseModule.forRoot('mongodb://127.0.0.1:27017/local-color-on-me'), UserModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
