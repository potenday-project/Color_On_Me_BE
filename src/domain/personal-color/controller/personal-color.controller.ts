import { Controller } from '@nestjs/common';
import { PersonalColorService } from '../service/personal-color.service';

@Controller('personal-color')
export class PersonalColorController {
    constructor(private readonly personalColorService: PersonalColorService) {}
}
