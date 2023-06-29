import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver-v2';
import { ConfigService } from 'src/domain/config/config.service';
import { UserService } from 'src/domain/user/service/user.service';
import { AuthService } from '../auth.service';
import { SignupType } from 'src/domain/user/model/enums/signup-type.enum';

@Injectable()
export class JwtSocialNaverStrategy extends PassportStrategy(Strategy, 'naver') {
    constructor(
        private configService: ConfigService,
        private userService: UserService,
        private authService: AuthService,
    ) {
        super({
            clientID: configService.get('NAVER_CLIENT_ID'),
            clientSecret: configService.get('NAVER_CLIENT_SECRET'),
            callbackURL: configService.get('NAVER_CALLBACK_URL'),
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
        const { id: naverId, profileImage: profileImageUrl, name, email } = profile;
        const user = await this.userService.findUserOrCreate({
            naverId,
            profileImageUrl,
            name,
            email,
            signupType: SignupType['naver'],
        });

        const jwtAccessToken = await this.authService.createAccessToken(user._id);
        const jwtRefreshToken = await this.authService.createRefreshToken(user._id);

        return { user, jwtAccessToken, jwtRefreshToken };
    }
}
