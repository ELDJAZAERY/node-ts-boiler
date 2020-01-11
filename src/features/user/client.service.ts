import CreateUserDTO from './dtos/create.user.dto';
import UpdateUserDTO from './dtos/update.user.dto';

import HttpException from '../../exceptions/httpException';
import { HttpStatusEnum } from '../../shared';
import { Not } from 'typeorm';
import Client from './models/client.model';

export default class ClientService {
  static createClient = async (
    createUserDTO: CreateUserDTO
  ): Promise<Client> => {
    let client: Client = new Client();
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
    updateUserDTO: UpdateUserDTO
  ): Promise<Client> => {
    let client: Client | undefined = await Client.findOne(identificator);

    if (client) {
      client = await client.updateBasicInfosUser(updateUserDTO);
      return client;
    }

    return Promise.reject(
      new HttpException(HttpStatusEnum.BAD_REQUEST, 'Client not found')
    );
  };

  static getAllClients = async (
    identificator: string
  ): Promise<Client[] | undefined> => {
    return Client.find({ identificator: Not(identificator) });
  };

  static getClient = async (identificator: any): Promise<Client> => {
    const client: Client | undefined = await Client.findOne(identificator);

    if (client) return client;

    return Promise.reject(
      new HttpException(HttpStatusEnum.BAD_REQUEST, 'Client not found')
    );
  };
}
