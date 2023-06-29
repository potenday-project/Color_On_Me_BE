import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { ConfigService } from '../config/config.service';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { JwtSocialNaverStrategy } from './strategy/jwt-social-naver.strategy';
import { JwtRefreshTokenStrategy } from './strategy/jwt-refresh-token.strategy';
import { JwtAccessTokenStrategy } from './strategy/jwt-access-token.strategy';
import { JwtSocialKakaoStrategy } from './strategy/jwt-social-kakao.strategy';

@Module({
    imports: [ConfigModule.forRoot(), JwtModule.register({}), UserModule],
    providers: [
        JwtSocialNaverStrategy,
        JwtRefreshTokenStrategy,
        JwtAccessTokenStrategy,
        JwtSocialKakaoStrategy,
        ConfigService,
        AuthService,
    ],
    controllers: [AuthController],
})
export class AuthModule {}
