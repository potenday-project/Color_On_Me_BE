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
}
