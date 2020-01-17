import HttpException from '../../exceptions/httpException';
import { HttpStatusEnum } from '../../shared';

import { Partner, CreatePartnerDTO } from '.';

export default class GroupService {
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
        new HttpException(HttpStatusEnum.BAD_REQUEST, 'Something went wrong')
      );
    }
  };
}
