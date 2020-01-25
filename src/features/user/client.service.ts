import { CreateClientDTO } from './dtos/create.user.dto';
import { UpdateClientDTO } from './dtos/update.user.dto';

import HttpException from '../../exceptions/httpException';
import { HttpStatusEnum } from '../../shared';
import { Not } from 'typeorm';
import Client from './models/client.model';
import UserManager from './models/user.manager';
import { PartnerService, Partner } from '../Partner';
import UpdateUserPwdDTO from './dtos/update.user.password.dto';
import { IUser } from '.';
import { ClientRoleEnum, OwnerRoleEnum } from './enums/roles.Enum';

export default class ClientService {
  static createClient = async (
    createClientDTO: CreateClientDTO,
    iUser: IUser
  ): Promise<Client> => {
    if (
      createClientDTO.role === ClientRoleEnum.CLIENT_ADMIN &&
      (!iUser.isOwner || iUser.role !== OwnerRoleEnum.SUPER)
    )
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          'Permission denied, you cannot create a client administrator account'
        )
      );

    await UserManager.idValidator(createClientDTO.identificator);

    const partner: Partner = await PartnerService.getPartner(
      createClientDTO.tradeRegister
    );

    let client: Client = new Client(partner);
    client.preSave(createClientDTO);

    try {
      client = await client.save();
      return client;
    } catch {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          'Identifier is already used'
        )
      );
    }
  };

  static updateClient = async (
    identificator: string,
    updateUserDTO: UpdateClientDTO
  ): Promise<Client> => {
    let client: Client | undefined = await Client.findOne({ identificator });

    if (client) {
      client = await client.updateBasicInfos(updateUserDTO);
      return client;
    }

    return Promise.reject(
      new HttpException(HttpStatusEnum.BAD_REQUEST, 'Client not found')
    );
  };

  static getAllClients = async (): Promise<Client[]> => {
    let clients = await Client.find({ loadEagerRelations: false });
    clients = clients.map(client => client.normalize());
    return clients;
  };

  static getPartnerClient = async (
    tradeRegister: string
  ): Promise<Client[]> => {
    let clients = await Client.getRepository()
      .createQueryBuilder('client')
      .leftJoin('client.partner', 'partner')
      .where(`partner.tradeRegister = :tradeRegister`, { tradeRegister })
      .getMany();
    clients = clients.map(client => client.normalize());
    return clients;
  };

  static getClient = async (
    identificator: any,
    eager?: boolean
  ): Promise<Client> => {
    const client: Client | undefined = await Client.findOne(
      { identificator },
      { loadEagerRelations: eager ? true : false }
    );

    if (client) return client;

    return Promise.reject(
      new HttpException(HttpStatusEnum.BAD_REQUEST, 'Client not found')
    );
  };

  static updateClientPWD = async (
    identificator: string,
    updateUserPwdDTO: UpdateUserPwdDTO
  ): Promise<Client> => {
    let client: Client | undefined = await Client.findOne(
      { identificator },
      { loadEagerRelations: false }
    );

    if (client) {
      client = await client.updatePWD(updateUserPwdDTO);
      return client;
    }

    return Promise.reject(
      new HttpException(HttpStatusEnum.BAD_REQUEST, 'Client not found')
    );
  };
}
