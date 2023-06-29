import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../model/user.model';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

    async getUsers(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async createUser(user: User): Promise<User> {
        const createdUser = new this.userModel(user);
        return createdUser.save();
    }

    async getUser(userId: string): Promise<User> {
        const user = await this.userModel.findById(userId);
        return user;
    }

    async updatePersonalColor(userId: string, personalColor: string): Promise<User> {
        const updatedUser = await this.userModel.findByIdAndUpdate(userId, { personalColor }, { new: true });
        return updatedUser;
    }

    async findUserOrCreate(user: Partial<User>): Promise<User> {
        const { naverId, email, name, profileImageUrl, signupType } = user;
        const findUser = await this.userModel.findOne({ naverId, email });

        if (findUser) {
            return findUser;
        }

        return await this.createUser({
            email,
            naverId,
            name,
            profileImageUrl,
            signupType,
        });
    }

    async updateHashRefreshToken(userId: string, hashedRefreshToken: string): Promise<void> {
        await this.userModel.findByIdAndUpdate(
            {
                _id: userId,
            },
            {
                currentHashedRefreshToken: hashedRefreshToken,
            },
        );
    }

    async removeHashRefreshToken(userId: string): Promise<void> {
        await this.userModel.findByIdAndUpdate(
            {
                _id: userId,
            },
            {
                currentHashedRefreshToken: null,
            },
        );
    }
}
