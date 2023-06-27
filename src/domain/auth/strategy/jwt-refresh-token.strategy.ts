import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from 'src/domain/config/config.service';
import { Request } from 'express';

type Payload = {
    userId: string;
    email: string;
    iat: number; // jwt가 발급된 시간
    exp: number; // jwt 만료 시간
};

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request.headers['refreshToken'];
                },
            ]),
            secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
            passReqToCallback: true,
        });
    }

    async validate(request: Request, payload: Payload) {
        const refreshToken = request.headers['refreshToken'];

        if (!refreshToken) throw new UnauthorizedException('REFRESH TOKEN DOES NOT EXIST');

        return {
            ...payload,
            refreshToken,
        };
    }
}
