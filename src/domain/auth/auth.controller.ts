import { Controller, Get, Res, UseGuards, Req, Post } from '@nestjs/common';
import { Response } from 'express';
import { NaverAuthGuard } from './guard/naver-auth.guard';
import { JwtAccessTokenAuthGuard } from './guard/jwt-access-token-auth.guard';
import { JwtRefreshTokenAuthGuard } from './guard/jwt-refresh-token-auth.guard';
import { AuthService } from './auth.service';
import { GetCurrentUserId } from '../common/decorators/get-current-user-id.decorator';
import { GetCurrentUser } from '../common/decorators/get-current-user.decorator';
import { ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('/login/naver')
    @UseGuards(NaverAuthGuard)
    @ApiOperation({ summary: '네이버 로그인' })
    async loginNaver() {}

    @Get('/login/naver/callback')
    @ApiOperation({ summary: '네이버 로그인 후 콜백 URL' })
    @UseGuards(NaverAuthGuard)
    @ApiOkResponse({ description: 'Login Success!' })
    async loginNaverCallback(@Req() req, @Res() res: Response) {
        const { jwtAccessToken, jwtRefreshToken } = req.user;

        res.cookie('access_token', jwtAccessToken);
        res.cookie('refresh_token', jwtRefreshToken);

        // TODO: 협의해서 어떤 주소로 돌려줘야할지
        // res.redirect("/personal-color")

        res.status(200).send({ message: 'Login Success!' });
    }

    @Get('/logout')
    @UseGuards(JwtAccessTokenAuthGuard)
    @ApiOperation({ summary: '로그 아웃' })
    @ApiHeader({ name: 'authorization', description: 'access_token' })
    @ApiOkResponse({ description: 'Logout Success!' })
    async logout(@GetCurrentUserId() userId: string, @Res() res: Response) {
        await this.authService.removeRefreshToken(userId);

        res.clearCookie('access_token');
        res.clearCookie('refresh_token');

        return res.status(200).send({ message: 'Logout Success!' });
    }

    @Post('/refresh')
    @UseGuards(JwtRefreshTokenAuthGuard)
    @ApiOperation({ summary: '토큰 재발급' })
    @ApiHeader({ name: 'authorization', description: 'refresh_token' })
    async refreshToken(
        @GetCurrentUserId() userId: string,
        @GetCurrentUser('refreshToken') token: string,
        @Res() res: Response,
    ) {
        await this.authService.validateRefreshToken(userId, token);

        const jwtAccessToken = await this.authService.createAccessToken(userId);
        const jwtRefreshToken = await this.authService.createRefreshToken(userId);

        res.status(201).send({
            access_token: jwtAccessToken,
            refresh_token: jwtRefreshToken,
        });
    }
}
