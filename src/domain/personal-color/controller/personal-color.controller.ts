import { Controller, Get, Param } from '@nestjs/common';
import { PersonalColorService } from '../service/personal-color.service';

@Controller('personal-color')
export class PersonalColorController {
    constructor(private readonly personalColorService: PersonalColorService) {}

    @Get()
    async findAll() {
        return await this.personalColorService.findAll();
    }

    @Get(':code')
    async getUserColor(@Param('code') code: string) {
        return await this.personalColorService.getUserColor(code);
    }
}
