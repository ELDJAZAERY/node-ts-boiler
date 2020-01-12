/**
 *
 * @__Abstract__USER__CLASS_
 *
 * ## Contains all communs (columns & function)
 * extended by ( @_Client , @_Owner )
 *
 */

import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  Column,
  Index
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import CreateUserDTO from '../dtos/create.user.dto';
import UpdateUserDTO from '../dtos/update.user.dto';
import UpdateUserPwdDTO from '../dtos/update.user.password.dto';
import HttpException from '../../../exceptions/httpException';
import { HttpStatusEnum } from '../../../shared';

import PwdCrypto from '../../../utils/crypto';

export default abstract class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: String;

  @Index({ unique: true })
  @Column({ type: 'varchar' })
  identificator: String;

  @Column({ type: 'varchar' })
  designation: String;

  @Column({
    name: 'is_activated',
    type: 'boolean',
    nullable: false,
    default: false
  })
  isActivated: boolean;

  @Column({
    name: 'is_request_visible',
    type: 'boolean',
    nullable: false,
    default: true
  })
  isRequestVisible: boolean;

  @Column({
    name: 'is_keys_visible',
    type: 'boolean',
    nullable: false,
    default: true
  })
  isKeysVisible: boolean;

  @Column({
    name: 'is_keys_editable',
    type: 'boolean',
    nullable: false,
    default: true
  })
  isKeysEditable: boolean;

  @Column({
    name: 'is_historic_visible',
    type: 'boolean',
    nullable: false,
    default: true
  })
  isHistoricVisible: boolean;

  @IsNotEmpty()
  @Column({ type: 'varchar' })
  password: string;

  @IsNotEmpty()
  @Column({ type: 'varchar' })
  secretKey: string;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @Column('json', { default: [] })
  refreshTokens: string[];

  protected preSaveUser = (createUserDTO: CreateUserDTO): any => {
    const {
      identificator,
      designation,
      password,
      confirmPassword,
      isActivated,
      isHistoricVisible,
      isKeysEditable,
      isKeysVisible,
      isRequestVisible
    } = createUserDTO;
    if (password !== confirmPassword)
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          'Your password and confirmation password do not match'
        )
      );

    this.identificator = identificator;
    this.designation = designation;
    this.isActivated = isActivated;
    this.isHistoricVisible = isHistoricVisible;
    this.isKeysEditable = isKeysEditable;
    this.isKeysVisible = isKeysVisible;
    this.isRequestVisible = isRequestVisible;
    this.password = password;
    this.cryptePWD();

    return true;
  };

  protected updateBasicInfosUser = (updateUserDTO: UpdateUserDTO): void => {
    const {
      designation,
      isActivated,
      isHistoricVisible,
      isKeysEditable,
      isKeysVisible,
      isRequestVisible
    } = updateUserDTO;

    this.designation = designation;
    this.isActivated = isActivated;
    this.isHistoricVisible = isHistoricVisible;
    this.isKeysEditable = isKeysEditable;
    this.isKeysVisible = isKeysVisible;
    this.isRequestVisible = isRequestVisible;
  };

  protected updatePWDUser = (updateUserPwdDTO: UpdateUserPwdDTO): any => {
    const { password, newPassword, confirmPassword } = updateUserPwdDTO;
    const oldPwd = this.decryptPWD();
    if (newPassword === confirmPassword && password === oldPwd) {
      this.password = newPassword;
      this.cryptePWD();
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

  protected normalizeUser = (): void => {
    delete this.id;
    delete this.password;
    delete this.secretKey;
    delete this.save;
    delete this.preSaveUser;
    delete this.updateBasicInfosUser;
    delete this.updatePWDUser;
    delete this.normalizeUser;
    delete this.cryptePWD;
    delete this.decryptPWD;
    delete this.checkPWD;
    delete this.checkRefreshTokenUser;
  };

  protected saveRefreshTokenUser = (refreshToken: string): void => {
    this.refreshTokens.push(refreshToken);
  };

  protected checkRefreshTokenUser = (refreshToken: string): boolean => {
    const isValid = this.refreshTokens.includes(refreshToken);
    if (isValid) {
      this.refreshTokens = this.refreshTokens.filter(
        val => val !== refreshToken
      );
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
