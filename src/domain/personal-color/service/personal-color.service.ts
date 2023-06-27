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
}
