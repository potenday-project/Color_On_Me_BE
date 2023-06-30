import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { ConfigService } from 'src/domain/config/config.service';
import { UserService } from 'src/domain/user/service/user.service';
import { AuthService } from '../auth.service';
import { SignupType } from 'src/domain/user/model/enums/signup-type.enum';

@Injectable()
export class JwtSocialKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
    constructor(
        private configService: ConfigService,
        private userService: UserService,
        private authService: AuthService,
    ) {
        super({
            clientID: configService.get('KAKAO_REST_API_KEY'),
            callbackURL: configService.get('KAKAO_CALLBACK_URL'),
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
        const { email } = profile._json.kakao_account;
        const { nickname, profile_image } = profile._json.properties;

        const user = await this.userService.findUserOrCreate({
            profileImageUrl: profile_image,
            nickname,
            email,
            signupType: SignupType['kakao'],
        });

        const jwtAccessToken = await this.authService.createAccessToken(user._id);
        const jwtRefreshToken = await this.authService.createRefreshToken(user._id);

        return { user, jwtAccessToken, jwtRefreshToken };
    }
}
