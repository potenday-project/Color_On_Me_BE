import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PersonalColorService } from './service/personal-color.service';
import { PersonalColor, PersonalColorSchema } from './model/personal-color.model';
import { PersonalColorController } from './controller/personal-color.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: PersonalColor.name, schema: PersonalColorSchema }])],
    controllers: [PersonalColorController],
    providers: [PersonalColorService],
})
export class PersonalColorModule {}
