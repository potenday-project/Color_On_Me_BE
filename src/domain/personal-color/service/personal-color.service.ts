import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PersonalColor } from '../model/personal-color.model';
import * as fs from 'fs';

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

    async createColorData(): Promise<void> {
        const existingData = await this.personalColorModel.findOne();

        if (!existingData) {
            const fileData = fs.readFileSync('scripts/personal-color_Data.json', 'utf-8');
            const colorData = JSON.parse(fileData);

            await this.personalColorModel.create(colorData);

            console.log('데이터가 없어서 넣음!');
        } else {
            throw new ConflictException('퍼스널 컬러 데이터가 이미 존재합니다.');
        }
    }
}
