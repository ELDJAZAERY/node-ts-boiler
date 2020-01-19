import { Entity, Column } from 'typeorm';

import User from './user.model';
import { CreateOwnerDTO } from '../dtos/create.user.dto';
import { UpdateOwnerDTO } from '../dtos/update.user.dto';
import UpdateUserPwdDTO from '../dtos/update.user.password.dto';
import { OwnerRoleEnum } from '../enums/roles.Enum';

@Entity({ name: 'owner_access' })
export default class Owner extends User {
  static readonly TABLE_NAME = 'owner_access';

  @Column({ type: 'varchar', nullable: false, default: OwnerRoleEnum.BASIC })
  role: OwnerRoleEnum;

  preSave = (createOwnerDTO: CreateOwnerDTO): any => {
    this.preSaveUser(createOwnerDTO);
    this.role = createOwnerDTO.role;
  };

  updateBasicInfos = (updateUserDTO: UpdateOwnerDTO): Promise<Owner> => {
    this.updateBasicInfosUser(updateUserDTO);
    this.role = updateUserDTO.role;
    return this.save();
  };

  updatePWD = (updateUserPwdDTO: UpdateUserPwdDTO): Promise<Owner> => {
    this.updatePWDUser(updateUserPwdDTO);
    return this.save();
  };

  saveRefreshToken = (refreshToken: string): Promise<Owner> => {
    this.saveRefreshTokenUser(refreshToken);
    return this.save();
  };

  checkRefreshToken = async (refreshToken: string): Promise<Boolean> => {
    const isValid: boolean = this.checkRefreshTokenUser(refreshToken);
    if (isValid) await this.save();
    return isValid;
  };

  normalize = (): Owner => {
    this.normalizeUser();
    delete this.preSave;
    delete this.updateBasicInfos;
    delete this.updatePWD;
    delete this.saveRefreshToken;
    delete this.checkRefreshToken;
    delete this.normalize;
    return this;
  };
}
