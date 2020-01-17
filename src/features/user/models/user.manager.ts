/**
 *
 * @_USER_MANAGER_
 *
 * ## used for manage the 2 ( @owner , @client ) entities extends the User Entity
 * ## allowed execute the cmds on the right entity
 *
 */

import Owner from './owner.model';
import Client from './client.model';
import { IUser } from '..';
import HttpException from '../../../exceptions/httpException';
import { HttpStatusEnum } from '../../../shared';

export default class UserManager {
  /**
   *
   * @param identificator
   *
   * @OBJ_RETURNED___IUSER
   * ## IUSER OBject will injected in each request to know wich user is connected
   *
   */
  static getIUser = async (
    identificator: string
  ): Promise<IUser | undefined> => {
    const isOwnerUser: Owner | undefined = await Owner.findOne({
      identificator
    });
    if (isOwnerUser) {
      isOwnerUser.normalize();
      return { ...isOwnerUser, isOwner: true };
    } else {
      const isClient: Client | undefined = await Client.findOne({
        identificator
      });
      if (isClient) {
        isClient.normalize();
        return { ...isClient, isOwner: false };
      } else
        return Promise.reject(
          new HttpException(HttpStatusEnum.BAD_REQUEST, 'User not found')
        );
    }
  };

  static findOne = async (identificator: string): Promise<Owner | Client> => {
    const ownerUser: Owner | undefined = await Owner.findOne({ identificator });
    if (ownerUser) {
      return ownerUser;
    }

    const clientUser: Client | undefined = await Client.findOne({
      identificator
    });
    if (clientUser) {
      return clientUser;
    }

    return Promise.reject(
      new HttpException(HttpStatusEnum.BAD_REQUEST, 'User not found')
    );
  };

  static idValidator = async (identificator: String): Promise<boolean> => {
    try {
      await UserManager.getIUser(identificator as string);

      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          'Identifier is already used'
        )
      );
    } catch (e) {
      return Promise.resolve(true);
    }
  };
}
