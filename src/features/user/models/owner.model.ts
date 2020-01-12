import { Entity, Column } from 'typeorm';

import RoleEnum from '../enums/roles.Enum';
import User from './user.model';
import CreateUserDTO from '../dtos/create.user.dto';
import UpdateUserDTO from '../dtos/update.user.dto';
import UpdateUserPwdDTO from '../dtos/update.user.password.dto';

@Entity({ name: 'owner_access' })
export default class Owner extends User {
  static readonly TABLE_NAME = 'owner_access';

  @Column({ type: 'varchar', nullable: false, default: RoleEnum.BASIC })
  role: RoleEnum;

  preSave = (createUserDTO: CreateUserDTO): any => {
    this.preSaveUser(createUserDTO);
    this.role = createUserDTO.role;
  };

  updateBasicInfos = (updateUserDTO: UpdateUserDTO): Promise<Owner> => {
    this.updateBasicInfosUser(updateUserDTO);
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
    return this;
  };
}
