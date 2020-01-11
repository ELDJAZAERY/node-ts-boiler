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

  preSaveUser = (createUserDTO: CreateUserDTO): any => {
    this.preSave(createUserDTO);
    this.role = createUserDTO.role;
  };

  updateBasicInfosUser = (updateUserDTO: UpdateUserDTO): Promise<Owner> => {
    this.updateBasicInfos(updateUserDTO);
    return this.save();
  };

  updatePWDUser = (updateUserPwdDTO: UpdateUserPwdDTO): Promise<Owner> => {
    this.updatePWD(updateUserPwdDTO);
    return this.save();
  };

  saveRefreshTokenUser = (refreshToken: string): Promise<Owner> => {
    this.saveRefreshToken(refreshToken);
    return this.save();
  };

  checkRefreshTokenUser = async (refreshToken: string): Promise<Boolean> => {
    const isValid: boolean = this.checkRefreshToken(refreshToken);
    if (isValid) await this.save();
    return isValid;
  };
}
