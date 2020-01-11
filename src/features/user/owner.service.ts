import CreateUserDTO from './dtos/create.user.dto';
import UpdateUserDTO from './dtos/update.user.dto';
import HttpException from '../../exceptions/httpException';
import { HttpStatusEnum } from '../../shared';
import Owner from './models/owner.model';
import { Not } from 'typeorm';

export default class OwnerService {
  static createOwner = async (createUserDTO: CreateUserDTO): Promise<Owner> => {
    let owner: Owner = new Owner();
    owner.preSaveUser(createUserDTO);
    try {
      owner = await owner.save();
      return owner;
    } catch {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          'Identifier is already used'
        )
      );
    }
  };

  static updateOwner = async (
    identificator: string,
    updateUserDTO: UpdateUserDTO
  ): Promise<Owner> => {
    let owner: Owner | undefined = await Owner.findOne(identificator);

    if (owner) {
      owner = await owner.updateBasicInfosUser(updateUserDTO);
      return owner;
    }

    return Promise.reject(
      new HttpException(HttpStatusEnum.BAD_REQUEST, 'User not found')
    );
  };

  static getAllOwners = async (
    identificator: string
  ): Promise<Owner[] | undefined> => {
    return Owner.find({ identificator: Not(identificator) });
  };

  static getOwner = async (identificator: any): Promise<Owner> => {
    const owner: Owner | undefined = await Owner.findOne(identificator);

    if (owner) return owner;

    return Promise.reject(
      new HttpException(HttpStatusEnum.BAD_REQUEST, 'User not found')
    );
  };
}
