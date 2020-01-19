import { Entity, Column, ManyToOne } from 'typeorm';

import User from './user.model';
import { CreateClientDTO } from '../dtos/create.user.dto';
import { UpdateClientDTO } from '../dtos/update.user.dto';
import UpdateUserPwdDTO from '../dtos/update.user.password.dto';
import { Partner } from '../../Partner';
import { ClientRoleEnum } from '../enums/roles.Enum';

@Entity({ name: 'client_access' })
export default class Client extends User {
  static readonly TABLE_NAME = 'client_access';

  @Column({ type: 'varchar', nullable: false, default: ClientRoleEnum.BASIC })
  role: ClientRoleEnum;

  @ManyToOne(
    type => Partner,
    partner => partner.clients,
    { eager: true, nullable: false }
  )
  partner: Partner;

  constructor(partner: Partner) {
    super();
    this.partner = partner;
  }

  preSave = (createClientDTO: CreateClientDTO): any => {
    this.preSaveUser(createClientDTO);
    this.role = createClientDTO.role;
  };

  updateBasicInfos = (updateUserDTO: UpdateClientDTO): Promise<Client> => {
    this.updateBasicInfosUser(updateUserDTO);
    this.role = updateUserDTO.role;
    return this.save();
  };

  updatePWD = async (updateUserPwdDTO: UpdateUserPwdDTO): Promise<Client> => {
    await this.updatePWDUser(updateUserPwdDTO);
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
    delete this.preSave;
    delete this.updateBasicInfos;
    delete this.updatePWD;
    delete this.saveRefreshToken;
    delete this.checkRefreshToken;
    delete this.normalize;
    return this;
  };
}
