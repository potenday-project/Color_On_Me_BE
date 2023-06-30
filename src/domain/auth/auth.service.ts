import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import { compare, hash } from 'bcrypt';
import { UserService } from '../user/service/user.service';
import { SignUpDto } from './dto/signup.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/model/user.model';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { SignupType } from '../user/model/enums/signup-type.enum';
import { CheckEmailDto } from './dto/check-email.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private jwtService: JwtService,
        private configService: ConfigService,
        private userService: UserService,
    ) {}

    async validateEmail(emailCheckDto: CheckEmailDto) {
        const { email } = emailCheckDto;

        const user = await this.userService.getUserByEmail(email);
        if (user) {
            throw new HttpException('중복되는 이메일이 존재합니다.', HttpStatus.CONFLICT);
        }

        return true;
    }

    async validateLogin(loginDto: LoginDto) {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) {
            throw new NotFoundException('계정이 존재하지 않습니다!');
        }

        const passwordCompareResult = await bcrypt.compare(password, user.password);
        if (!passwordCompareResult) {
            throw new UnauthorizedException('비밀번호가 일치하지 않습니다');
        }

        return user;
    }

    async validateSignup(signUpDto: SignUpDto) {
        const { email, password, passwordConfirm } = signUpDto;

        const existingUser = await this.userModel.findOne({ email }).exec();
        if (existingUser) {
            throw new ConflictException('이메일이 이미 존재합니다.');
        }

        if (password !== passwordConfirm) {
            throw new BadRequestException('비밀번호와 비밀번호 확인이 서로 다릅니다.');
        }

        return true;
    }

    async signUp(signUpDto: SignUpDto): Promise<User> {
        const { email, password, nickname } = signUpDto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new this.userModel({
            email,
            password: hashedPassword,
            nickname,
            signupType: SignupType['local'],
        });
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
