import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '../model/user.model';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getUsers(): Promise<User[]> {
        return this.userService.getUsers();
    }

    //! 데이터 확인하기 위해 임시로 만듦
    @Post()
    async createUser(@Body() user: User): Promise<User> {
        return this.userService.createUser(user);
    }
}
