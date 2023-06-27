import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from 'src/domain/config/config.service';
import { AuthService } from '../auth.service';
import { Request } from 'express';

type Payload = {
    userId: string;
    email: string;
    iat: number; // jwt가 발급된 시간
    exp: number; // jwt 만료 시간
};

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly configService: ConfigService, private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request.headers['accessToken'];
                },
            ]),
            secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
            ignoreExpiration: true,
        });
    }

    async validate(payload: Payload) {
        const currentTime = new Date().getTime();
        const { userId, exp } = payload;

        const user = await this.authService.validateUser(userId);
        if (!user) {
            throw new UnauthorizedException('USER not found');
        }

        if (exp * 1000 - currentTime < 0) {
            throw new UnauthorizedException('Token is Expired!');
        }

        return payload;
    }
}
