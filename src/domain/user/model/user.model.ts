import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
    _id?: string;

    @Prop({ type: String, required: true })
    email: string;

    @Prop({ type: String, required: true })
    naverId: string;

    @Prop({ type: String, required: true })
    profileImageUrl: string;

    @Prop({ type: String, required: true })
    nickname: string;

    @Prop({ type: String, required: false })
    personalColor?: string;

    @Prop({ type: String, required: false })
    currentHashedRefreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
