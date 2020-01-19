import { CreateOwnerDTO } from './dtos/create.user.dto';
import { UpdateOwnerDTO } from './dtos/update.user.dto';
import HttpException from '../../exceptions/httpException';
import { HttpStatusEnum } from '../../shared';
import Owner from './models/owner.model';
import { Not } from 'typeorm';
import UserManager from './models/user.manager';
import UpdateUserPwdDTO from './dtos/update.user.password.dto';

export default class OwnerService {
  static createOwner = async (
    createOwnerDTO: CreateOwnerDTO
  ): Promise<Owner> => {
    let owner: Owner = new Owner();
    owner.preSave(createOwnerDTO);
    try {
      await UserManager.idValidator(createOwnerDTO.identificator);
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
    updateUserDTO: UpdateOwnerDTO
  ): Promise<Owner> => {
    let owner: Owner | undefined = await Owner.findOne({ identificator });

    if (owner) {
      owner = await owner.updateBasicInfos(updateUserDTO);
      return owner;
    }

    return Promise.reject(
      new HttpException(HttpStatusEnum.BAD_REQUEST, 'User not found')
    );
  };

  static getAllOwners = async (
    identificator: string
  ): Promise<Owner[] | undefined> => {
    let owners = await Owner.find({ identificator: Not(identificator) });
    owners = owners.map(owner => owner.normalize());
    return owners;
  };

  static getOwner = async (identificator: any): Promise<Owner> => {
    const owner: Owner | undefined = await Owner.findOne({ identificator });

    if (owner) return owner;

    return Promise.reject(
      new HttpException(HttpStatusEnum.BAD_REQUEST, 'User not found')
    );
  };

  static updateOwnerPWD = async (
    identificator: string,
    updateUserPwdDTO: UpdateUserPwdDTO
  ): Promise<Owner> => {
    let owner: Owner | undefined = await Owner.findOne({ identificator });

    if (owner) {
      owner = await owner.updatePWD(updateUserPwdDTO);
      return owner;
    }

    return Promise.reject(
      new HttpException(HttpStatusEnum.BAD_REQUEST, 'User not found')
    );
  };
}
