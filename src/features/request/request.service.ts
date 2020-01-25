import { RequestType, Level } from '.';
import CreateTypeDTO from './dto/create.type.dto';
import CreateLevelDTO from './dto/create.level.dto';
import HttpException from '../../exceptions/httpException';
import { HttpStatusEnum } from '../../shared';
import UpdateTypeDTO from './dto/update.type.dto';
import UpdateLevelDTO from './dto/update.level.dto';

export default class RequestService {
  static createType = async (
    createTypeDTO: CreateTypeDTO
  ): Promise<RequestType> => {
    const requestType: RequestType = new RequestType(createTypeDTO);
    await requestType.save();
    return requestType;
  };

  static updateType = async (
    updateTypeDTO: UpdateTypeDTO
  ): Promise<RequestType> => {
    const { type, newType } = updateTypeDTO;
    const requestType: RequestType | undefined = await RequestType.findOne({
      type
    });
    if (requestType) {
      try {
        const updated = await requestType.update(updateTypeDTO);
        return updated;
      } catch {
        return Promise.reject(
          new HttpException(
            HttpStatusEnum.BAD_REQUEST,
            `Request type ${newType} already exist`
          )
        );
      }
    }

    return Promise.reject(
      new HttpException(HttpStatusEnum.BAD_REQUEST, 'Invalide request type')
    );
  };

  static fetchTypes = async (): Promise<RequestType[]> => {
    return RequestType.find();
  };

  static createLevel = async (
    createLevelDTO: CreateLevelDTO
  ): Promise<Level> => {
    const requestType: RequestType | undefined = await RequestType.findOne({
      type: createLevelDTO.type
    });
    if (requestType) {
      const level: Level = new Level(createLevelDTO, requestType);
      await level.save();
      return level;
    }
    return Promise.reject(
      new HttpException(HttpStatusEnum.BAD_REQUEST, 'Invalide request type')
    );
  };

  static updateLevel = async (
    updateLevelDTO: UpdateLevelDTO
  ): Promise<Level> => {
    const requestType: RequestType | undefined = await RequestType.findOne({
      type: updateLevelDTO.type
    });
    if (requestType) {
      const { id } = updateLevelDTO;
      const level: Level | undefined = await Level.findOne(id);
      if (level) {
        const updated: Level = await level.update(updateLevelDTO, requestType);
        return updated;
      } else
        return Promise.reject(
          new HttpException(
            HttpStatusEnum.BAD_REQUEST,
            `This Level Does Not Exist`
          )
        );
    }
    return Promise.reject(
      new HttpException(HttpStatusEnum.BAD_REQUEST, 'Invalide request type')
    );
  };

  static fetchLevels = async (): Promise<Level[]> => {
    return Level.find();
  };

  static reciveRequest = async (): Promise<any> => {
    // GIS API with key auth
    // check key
    // get partner - check if partner is active
    // check request type
    // send request and receive data
    // create Request
    // daily counter trigger
    // rendre data
  };
}
