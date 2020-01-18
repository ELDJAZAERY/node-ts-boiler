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
import ClientService from '../client.service';

export default class UserManager {
  /**
   *
   * @param identificator
   *
   * @OBJ_RETURNED___IUSER
   * ## IUSER OBject will injected in each request to know wich user is connected
   *
   */
  static getIUser = async (identificator: string): Promise<IUser> => {
    const isOwnerUser: Owner | undefined = await Owner.findOne({
      identificator
    });

    if (isOwnerUser) {
      isOwnerUser.normalize();
      return { ...isOwnerUser, isOwner: true };
    }

    const isClient: Client | undefined = await Client.findOne(
      { identificator },
      { loadEagerRelations: true }
    );

    if (isClient) {
      isClient.normalize();
      if (isClient.partner && isClient.partner.isActive)
        return { ...isClient, isOwner: false };
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          'The business partner assigned to this account is deactivated'
        )
      );
    }

    return Promise.reject(
      new HttpException(HttpStatusEnum.BAD_REQUEST, 'User not found')
    );
  };

  static findOne = async (identificator: string): Promise<Owner | Client> => {
    const ownerUser: Owner | undefined = await Owner.findOne({ identificator });
    if (ownerUser) {
      return ownerUser;
    }

    const clientUser: Client | undefined = await Client.findOne(
      { identificator },
      { loadEagerRelations: true }
    );

    if (clientUser) {
      if (clientUser.partner && clientUser.partner.isActive) return clientUser;
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          'The business partner assigned to this account is deactivated'
        )
      );
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
