import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SignupType } from './enums/signup-type.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    _id?: string;

    @Prop({ type: String, required: true })
    email: string;

    @Prop({ type: String, required: false })
    password?: string;

    @Prop({ type: String, default: '' })
    profileImageUrl: string;

    @Prop({ type: String, required: true })
    nickname: string;

    @Prop({ type: String, required: false })
    personalColor?: string;

    @Prop({ type: String, enum: SignupType, required: true, default: SignupType['local'] })
    signupType: SignupType;

    @Prop({ type: String, required: false })
    currentHashedRefreshToken?: string;

    createdAt?: Date;
    updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
