import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Color {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true })
    code: string;

    @Prop({ type: Number, required: true })
    r: number;

    @Prop({ type: Number, required: true })
    g: number;

    @Prop({ type: Number, required: true })
    b: number;
}

export const ColorSchema = SchemaFactory.createForClass(Color);

@Schema()
export class Mood {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true })
    code: string;
}

export const MoodSchema = SchemaFactory.createForClass(Mood);

@Schema()
export class PersonalColor extends Document {
    @Prop({ type: String, required: true })
    code: string;

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: [ColorSchema], default: [] })
    colors: Color[];

    @Prop({ type: [MoodSchema], default: [] })
    moods: Mood[];
}

export const PersonalColorSchema = SchemaFactory.createForClass(PersonalColor);
