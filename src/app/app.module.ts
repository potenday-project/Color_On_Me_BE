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
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: process.env.NODE_ENV === 'development' ? '.env.development' : '.env.prod',
        }),
        MongooseModule.forRoot(process.env.MONGO_DB_URL),
        AuthModule,
        UserModule,
        PersonalColorModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
