import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import { compare, hash } from 'bcrypt';
import { UserService } from '../user/service/user.service';
import { SignUpDto } from './dto/signup.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/model/user.model';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private jwtService: JwtService,
        private configService: ConfigService,
        private userService: UserService,
    ) {}

    // 로컬 회원가입
    async signUp(signUpDto: SignUpDto): Promise<User> {
        const { email, password, nickname } = signUpDto;
        const existingUser = await this.userModel.findOne({ email }).exec();
        console.log('🚀  file: auth.service.ts:24  existingUser:', existingUser);
        if (existingUser) {
            throw new Error('이메일이 이미 존재합니다.');
        }
        console.log('123');

        const user = new this.userModel({ email, password, name: nickname });
        return await user.save();
    }

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
        const user = await this.userService.getUser(userId);

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
