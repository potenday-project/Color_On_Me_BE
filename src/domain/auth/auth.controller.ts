import { Controller, Get, Res, UseGuards, Req, Post } from '@nestjs/common';
import { Response } from 'express';
import { NaverAuthGuard } from './guard/naver-auth.guard';
import { JwtAccessTokenAuthGuard } from './guard/jwt-access-token-auth.guard';
import { JwtRefreshTokenAuthGuard } from './guard/jwt-refresh-token-auth.guard';
import { AuthService } from './auth.service';
import { GetCurrentUserId } from '../common/decorators/get-current-user-id.decorator';
import { GetCurrentUser } from '../common/decorators/get-current-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('/login/naver')
    @UseGuards(NaverAuthGuard)
    async loginNaver() {}

    @Get('/login/naver/callback')
    @UseGuards(NaverAuthGuard)
    async loginNaverCallback(@Req() req, @Res() res: Response) {
        const { jwtAccessToken, jwtRefreshToken } = req.user;

        res.cookie('accessToken', jwtAccessToken);
        res.cookie('refreshToken', jwtRefreshToken);

        res.status(200).redirect('http://localhost:3000');
    }

    @Get('/logout')
    @UseGuards(JwtAccessTokenAuthGuard)
    async logout(@GetCurrentUserId() userId: string, @Res() res: Response) {
        await this.authService.removeRefreshToken(userId);

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.status(200).redirect('http://localhost:3000/login');
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

        res.cookie('accessToken', jwtAccessToken);
        res.cookie('refreshToken', jwtRefreshToken);

        res.sendStatus(201);
    }
}
