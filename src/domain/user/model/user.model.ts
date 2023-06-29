import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SignupType } from './enums/signup-type.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
    _id?: string;

    @Prop({ type: String, required: true })
    email: string;

    @Prop({ type: String, required: false })
    naverId?: string;

    @Prop({ type: String, required: true })
    profileImageUrl: string;

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: false })
    personalColor?: string;

    @Prop({ type: String, enum: SignupType, required: true, default: SignupType['local'] })
    signupType: SignupType;

    @Prop({ type: String, required: false })
    currentHashedRefreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
