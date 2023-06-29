import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PersonalColor } from '../model/personal-color.model';

@Injectable()
export class PersonalColorService {
    constructor(
        @InjectModel(PersonalColor.name)
        private readonly personalColorModel: Model<PersonalColor>,
    ) {}

    async findAll(): Promise<PersonalColor[]> {
        return this.personalColorModel.find().exec();
    }

    async getPersonalColor(code: string): Promise<PersonalColor> {
        return await this.personalColorModel.findOne({ code });
    }
}
