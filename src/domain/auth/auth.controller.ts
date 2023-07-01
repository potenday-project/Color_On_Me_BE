import { Controller, Get, Res, UseGuards, Req, Post, Body } from '@nestjs/common';
import { Response, Request } from 'express';
import { NaverAuthGuard } from './guard/naver-auth.guard';
import { JwtAccessTokenAuthGuard } from './guard/jwt-access-token-auth.guard';
import { JwtRefreshTokenAuthGuard } from './guard/jwt-refresh-token-auth.guard';
import { AuthService } from './auth.service';
import { GetCurrentUserId } from '../common/decorators/get-current-user-id.decorator';
import { GetCurrentUser } from '../common/decorators/get-current-user.decorator';
import { KakaoAuthGuard } from './guard/kakao-auth.guard';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { CheckEmailDto } from './dto/check-email.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/email-check')
    async checkEmailDuplicate(@Res() res: Response, @Body() emailCheckDto: CheckEmailDto) {
        await this.authService.validateEmail(emailCheckDto);

        return res.status(200).send({
            message: '중복되는 이메일이 없습니다.',
        });
    }

    @Post('/signup')
    async signUp(@Res() res: Response, @Body() signUpDto: SignUpDto) {
        await this.authService.validateSignup(signUpDto);

        await this.authService.signUp(signUpDto);

        return res.status(201).send({
            message: '회원가입을 축하드립니다',
        });
    }

    @Post('/login')
    async login(@Res() res: Response, @Body() loginDto: LoginDto) {
        const user = await this.authService.validateLogin(loginDto);

        const jwtAccessToken = await this.authService.createAccessToken(user._id);
        const jwtRefreshToken = await this.authService.createRefreshToken(user._id);

        res.cookie('accessToken', jwtAccessToken, {
            secure: true,
            sameSite: 'none',
            httpOnly: true,
            domain: '.coloronme.site',
        });
        res.cookie('refreshToken', jwtRefreshToken, {
            secure: true,
            sameSite: 'none',
            httpOnly: true,
            domain: '.coloronme.site',
        });

        return res.sendStatus(200);
    }

    @Get('/login/naver')
    @UseGuards(NaverAuthGuard)
    async loginNaver() {}

    @Get('/login/naver/callback')
    @UseGuards(NaverAuthGuard)
    async loginNaverCallback(@Req() req, @Res() res: Response) {
        const { jwtAccessToken, jwtRefreshToken } = req.user;

        res.cookie('accessToken', jwtAccessToken, {
            secure: true,
            sameSite: 'none',
            httpOnly: true,
        });
        res.cookie('refreshToken', jwtRefreshToken, {
            secure: true,
            sameSite: 'none',
            httpOnly: true,
        });

        res.status(200).redirect('https://coloronme.site');
    }

    @Get('/login/kakao')
    @UseGuards(KakaoAuthGuard)
    async loginKakao() {}

    @Get('/login/kakao/callback')
    @UseGuards(KakaoAuthGuard)
    async loginKakaoCallback(@Req() req, @Res() res: Response) {
        const { jwtAccessToken, jwtRefreshToken } = req.user;

        res.cookie('accessToken', jwtAccessToken, {
            secure: true,
            sameSite: 'none',
            httpOnly: true,
            domain: '.coloronme.site',
        });
        res.cookie('refreshToken', jwtRefreshToken, {
            secure: true,
            sameSite: 'none',
            httpOnly: true,
            domain: '.coloronme.site',
        });

        res.status(200).redirect('https://coloronme.site');
    }

    @Get('/logout')
    @UseGuards(JwtAccessTokenAuthGuard)
    async logout(@GetCurrentUserId() userId: string, @Res() res: Response) {
        await this.authService.removeRefreshToken(userId);

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.status(200).redirect('https://www.coloronme.site/login');
    }

    @Post('/refresh')
    @UseGuards(JwtRefreshTokenAuthGuard)
    async refreshToken(
        @GetCurrentUserId() userId: string,
        @GetCurrentUser('refreshToken') token: string,
        @Res() res: Response,
    ) {
        await this.authService.validateRefreshToken(userId, token);

        const jwtAccessToken = await this.authService.createAccessToken(userId);
        const jwtRefreshToken = await this.authService.createRefreshToken(userId);

        res.cookie('accessToken', jwtAccessToken, {
            secure: true,
            sameSite: 'none',
            httpOnly: true,
            domain: '.coloronme.site',
        });
        res.cookie('refreshToken', jwtRefreshToken, {
            secure: true,
            sameSite: 'none',
            httpOnly: true,
            domain: '.coloronme.site',
        });

        res.sendStatus(201);
    }

    @Get('/user/me')
    async userMe(@Req() req: Request, @Res() res: Response) {
        const accessToken = req?.cookies['accessToken'];
        const refreshToken = req?.cookies['refreshToken'];

        if (!accessToken || !refreshToken) {
            return res.sendStatus(401);
        }

        res.status(200).send({
            message: 'User Me!',
        });
    }
}
