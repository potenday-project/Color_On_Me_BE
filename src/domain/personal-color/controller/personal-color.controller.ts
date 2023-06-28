import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAccessTokenAuthGuard } from 'src/domain/auth/guard/jwt-access-token-auth.guard';
import { PersonalColorService } from '../service/personal-color.service';

@Controller('personal-color')
export class PersonalColorController {
    constructor(private readonly personalColorService: PersonalColorService) {}

    @Get()
    @UseGuards(JwtAccessTokenAuthGuard)
    async findAll() {
        return await this.personalColorService.findAll();
    }

    @Get('/:code')
    @UseGuards(JwtAccessTokenAuthGuard)
    async getUserColor(@Param('code') code: string) {
        return await this.personalColorService.getUserColor(code);
    }
}
