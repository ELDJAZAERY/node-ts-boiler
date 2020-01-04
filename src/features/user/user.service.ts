import User from './models/user.model';
import CreateUserDTO from './dtos/create.user.dto';
import UpdateUserDTO from './dtos/update.user.dto';

import IUser from './interfaces/user.interface';
import HttpException from '../../exceptions/httpException';
import { HttpStatusEnum } from '../../shared';
import { Not } from 'typeorm';

export default class UserService {
  static createUser = (createUserDTO: CreateUserDTO): Promise<User> => {
    let user: User = new User();
    user.preSave(createUserDTO);
    return user.save();
  };

  static updateUser = async (
    username: string,
    updateUserDTO: UpdateUserDTO
  ): Promise<User> => {
    try {
      const user: User = await User.findOneOrFail({ username });
      return user.updateBasicInfos(updateUserDTO);
    } catch {
      return Promise.reject(
        new HttpException(HttpStatusEnum.BAD_REQUEST, 'User not found')
      );
    }
  };

  static getAllUsers = async (
    username: string
  ): Promise<User[] | undefined> => {
    return User.find({ username: Not(username) });
  };

  static getUser = async (username: any): Promise<User | undefined> => {
    return User.findOne({ username });
  };
}
