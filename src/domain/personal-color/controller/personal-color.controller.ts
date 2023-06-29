import { Controller, Get, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { JwtAccessTokenAuthGuard } from 'src/domain/auth/guard/jwt-access-token-auth.guard';
import { PersonalColorService } from '../service/personal-color.service';
import { PersonalColor } from '../model/personal-color.model';

@Controller('personal-color')
export class PersonalColorController {
    constructor(private readonly personalColorService: PersonalColorService) {}

    @Get()
    @UseGuards(JwtAccessTokenAuthGuard)
    async findAll(): Promise<PersonalColor[]> {
        return await this.personalColorService.findAll();
    }

    @Get('/:code')
    @UseGuards(JwtAccessTokenAuthGuard)
    async getPersonalColor(@Param('code') code: string) {
        const personalColor = await this.personalColorService.getPersonalColor(code);
        if (!personalColor) {
            throw new NotFoundException('Personal Color not found');
        }

        return personalColor;
    }
}
