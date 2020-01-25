import CreateKeyDTO from './dto/create.key.dto';
import Key from './models/keys.model';
import { Partner } from '../Partner';
import HttpException from '../../exceptions/httpException';
import { HttpStatusEnum } from '../../shared';
import UpdateKeyDTO from './dto/update.key.dto';

export default class KeyService {
  static createKey = async (createKeyDTO: CreateKeyDTO): Promise<Key> => {
    const { key, tradeRegister } = createKeyDTO;

    const partner: Partner | undefined = await Partner.findOne({
      tradeRegister
    });

    if (partner) {
      const createdKey: Key = new Key(key, partner);
      return createdKey;
    }

    return Promise.reject(
      new HttpException(
        HttpStatusEnum.BAD_REQUEST,
        `${tradeRegister} invalide trade register`
      )
    );
  };

  static updateKey = async (updateKeyDTO: UpdateKeyDTO): Promise<Key> => {
    const { key, newKey } = updateKeyDTO;

    const keyObj: Key | undefined = await Key.findOne({ key });
    const newKeyObj: Key | undefined = await Key.findOne({ key: newKey });

    if (keyObj && !newKeyObj) {
      const updated: Key = await keyObj.update(newKey);
      return updated;
    }

    return Promise.reject(
      new HttpException(HttpStatusEnum.BAD_REQUEST, `something went wrong`)
    );
  };
}
