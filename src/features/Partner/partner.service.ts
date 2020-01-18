import HttpException from '../../exceptions/httpException';
import { HttpStatusEnum } from '../../shared';

import { Partner, CreatePartnerDTO, PartnerService } from '.';

export default class GroupService {
  static fetchAll = (): Promise<Partner[]> => {
    return Partner.find();
  };

  static getPartner = async (tradeRegister: string): Promise<Partner> => {
    try {
      const partner: Partner = await Partner.findOneOrFail({ tradeRegister });
      return partner;
    } catch {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          `No valid business partner assigned to ${tradeRegister}`
        )
      );
    }
  };

  static updateOne = async (
    tradeRegister: string,
    createPartnerDTO: CreatePartnerDTO
  ) => {
    const partner: Partner = await PartnerService.getPartner(tradeRegister);
    partner.presave(createPartnerDTO);
    try {
      return partner.save();
    } catch {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          'Cannot be updated, Trade register already used'
        )
      );
    }
  };

  static createPartner = async (
    createPartnerDTO: CreatePartnerDTO
  ): Promise<Partner> => {
    try {
      let partner = new Partner();
      partner.presave(createPartnerDTO);
      partner = await partner.save();
      return partner;
    } catch {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          'Trade register already exist'
        )
      );
    }
  };
}
