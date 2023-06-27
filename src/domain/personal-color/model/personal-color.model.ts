import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class PersonalColor extends Document {
    @Prop({ type: String, required: true })
    code: string;

    @Prop({ type: String, required: true })
    name: string;

    @Prop([
        {
            name: { type: String, required: true },
            code: { type: String, required: true },
            r: { type: Number, required: true },
            g: { type: Number, required: true },
            b: { type: Number, required: true },
        },
    ])
    colors: {
        name: string;
        code: string;
        r: number;
        g: number;
        b: number;
    }[];

    @Prop([
        {
            name: { type: String, required: true },
            code: { type: String, required: true },
        },
    ])
    moods: {
        name: string;
        code: string;
    }[];
}

export const PersonalColorSchema = SchemaFactory.createForClass(PersonalColor);
