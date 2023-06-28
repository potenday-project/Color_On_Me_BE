import { Controller, Get, Body, UseGuards, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '../model/user.model';
import { JwtAccessTokenAuthGuard } from 'src/domain/auth/guard/jwt-access-token-auth.guard';
import { GetCurrentUserId } from 'src/domain/common/decorators/get-current-user-id.decorator';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('')
    @UseGuards(JwtAccessTokenAuthGuard)
    async getUser(@GetCurrentUserId() userId: string): Promise<User> {
        const user = await this.userService.getUser(userId);
        return user;
    }

    @Post('')
    @UseGuards(JwtAccessTokenAuthGuard)
    async updatePersonalColor(@GetCurrentUserId() userId: string, @Body('personalColor') personalColor: string) {
        const updatedUser = await this.userService.updatePersonalColor(userId, personalColor);
        return updatedUser;
    }
}
