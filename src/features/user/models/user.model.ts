import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  Column,
  Index
} from 'typeorm';
import RoleEnum from '../enums/roles.Enum';
import { IsAlphanumeric, IsNotEmpty } from 'class-validator';
import CreateUserDTO from '../dtos/create.user.dto';
import UpdateUserDTO from '../dtos/update.user.dto';
import UpdateUserPwdDTO from '../dtos/update.user.password.dto';
import HttpException from '../../../exceptions/httpException';
import { HttpStatusEnum } from '../../../shared';

import PwdCrypto from '../../../utils/crypto';

@Entity()
export default class User extends BaseEntity {
  static readonly TABLE_NAME = 'user';

  @PrimaryGeneratedColumn('uuid')
  id: String;

  @Index({ unique: true })
  @Column({ type: 'varchar' })
  username: String;

  @Index({ unique: true })
  @Column({ type: 'varchar' })
  email: String;

  @IsNotEmpty()
  @Column({ type: 'varchar' })
  password: string;

  @IsNotEmpty()
  @Column({ type: 'varchar' })
  secretKey: string;

  @Column({ type: 'varchar', nullable: false, default: RoleEnum.BASIC })
  role: RoleEnum;

  @Column({ type: 'boolean', nullable: false, default: false })
  isActivated: boolean;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @Column('json', { default: ['1'] })
  refreshTokens: string[];

  preSave = (createUserDTO: CreateUserDTO): Promise<any> => {
    const {
      username,
      email,
      password,
      confirmPassword,
      role,
      isActivated
    } = createUserDTO;
    if (password !== confirmPassword)
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          'Your password and confirmation password do not match'
        )
      );

    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
    this.isActivated = isActivated;
    this.cryptePWD();

    return Promise.resolve(true);
  };

  updateBasicInfos = (updateUserDTO: UpdateUserDTO): Promise<User> => {
    const { role, isActivated } = updateUserDTO;
    this.isActivated = isActivated;
    this.role = role;

    return this.save();
  };

  updatePWD = (updateUserPwdDTO: UpdateUserPwdDTO): Promise<User> => {
    const { password, newPassword, confirmPassword } = updateUserPwdDTO;
    const oldPwd = this.decryptPWD();
    if (newPassword === confirmPassword && password === oldPwd) {
      this.password = newPassword;
      this.cryptePWD();
      return this.save();
    } else
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          'Wrong Password Or Your password and confirmation password do not match'
        )
      );
  };

  checkPWD = (password: string): boolean => {
    const passDecrypted = this.decryptPWD();
    return password === passDecrypted;
  };

  normalize = (): User => {
    delete this.id;
    delete this.password;
    delete this.secretKey;
    delete this.save;
    delete this.preSave;
    delete this.updateBasicInfos;
    delete this.updatePWD;
    delete this.normalize;
    delete this.cryptePWD;
    delete this.decryptPWD;
    delete this.checkPWD;
    delete this.checkRefreshToken;
    return this;
  };

  saveRefreshToken = (refreshToken: string): Promise<User> => {
    this.refreshTokens.push(refreshToken);
    return this.save();
  };

  checkRefreshToken = async (refreshToken: string): Promise<boolean> => {
    const isValid = this.refreshTokens.includes(refreshToken);
    if (isValid) {
      this.refreshTokens = this.refreshTokens.filter(
        val => val !== refreshToken
      );
      await this.save();
      return true;
    }
    return false;
  };

  private cryptePWD = (): void => {
    const { pwdHashed, secretKeyHashed } = PwdCrypto.encrypt(this.password);

    this.password = pwdHashed;
    this.secretKey = secretKeyHashed;
  };

  private decryptPWD = (): String => {
    return PwdCrypto.decrypt(this.password, this.secretKey);
  };
}
