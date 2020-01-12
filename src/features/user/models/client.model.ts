import { Entity, Column } from 'typeorm';

import RoleEnum from '../enums/roles.Enum';
import User from './user.model';
import CreateUserDTO from '../dtos/create.user.dto';
import UpdateUserDTO from '../dtos/update.user.dto';
import UpdateUserPwdDTO from '../dtos/update.user.password.dto';

@Entity({ name: 'client_access' })
export default class Client extends User {
  static readonly TABLE_NAME = 'client_access';

  @Column({ type: 'varchar', nullable: false, default: RoleEnum.BASIC })
  role: RoleEnum;

  @Column()
  clients: string;

  preSave = (createUserDTO: CreateUserDTO): any => {
    this.preSaveUser(createUserDTO);
    this.role = createUserDTO.role;
    this.clients = 'no clients yet';
  };

  updateBasicInfos = (updateUserDTO: UpdateUserDTO): Promise<Client> => {
    this.updateBasicInfosUser(updateUserDTO);
    return this.save();
  };

  updatePWD = (updateUserPwdDTO: UpdateUserPwdDTO): Promise<Client> => {
    this.updatePWDUser(updateUserPwdDTO);
    return this.save();
  };

  saveRefreshToken = (refreshToken: string): Promise<Client> => {
    this.saveRefreshTokenUser(refreshToken);
    return this.save();
  };

  checkRefreshToken = async (refreshToken: string): Promise<Boolean> => {
    const isValid: boolean = this.checkRefreshTokenUser(refreshToken);
    if (isValid) await this.save();
    return isValid;
  };

  normalize = (): Client => {
    this.normalizeUser();
    return this;
  };
}
