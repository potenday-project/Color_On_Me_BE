import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import { compare, hash } from 'bcrypt';
import { UserService } from '../user/service/user.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private userService: UserService,
    ) {}

    async createAccessToken(userId: string): Promise<string> {
        const payload = {
            userId,
        };

        const token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRRED_TIME'),
        });

        return token;
    }

    async createRefreshToken(userId: string): Promise<string> {
        const payload = {
            userId,
        };

        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRRED_TIME'),
        });

        const hashedRefreshToken = await hash(token, 10);

        await this.userService.updateHashRefreshToken(userId, hashedRefreshToken);

        return token;
    }

    async validateRefreshToken(userId: string, token: string) {
        console.log(userId);
        const user = await this.userService.getUser(userId);
        console.log(user);

        if (!user) {
            throw new NotFoundException('USER not found!');
        }

        if (!user.currentHashedRefreshToken) {
            throw new NotFoundException('REFRESH TOKEN does not exist');
        }

        const isMatchRefreshToken = await compare(token, user.currentHashedRefreshToken);
        if (!isMatchRefreshToken) {
            throw new ForbiddenException('ACCESS DENIED');
        }

        return true;
    }

    async removeRefreshToken(userId: string) {
        await this.userService.removeHashRefreshToken(userId);
    }

    async validateUser(userId: string) {
        const user = await this.userService.getUser(userId);

        return !!user;
    }
}
