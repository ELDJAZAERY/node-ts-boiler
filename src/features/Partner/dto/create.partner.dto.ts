import { IsString, IsBoolean, IsNotEmpty, IsDefined } from 'class-validator';

export default class CreatePartnerDTO {
  @IsString()
  @IsNotEmpty()
  tradeRegister: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsBoolean()
  @IsDefined()
  isActive: boolean;
}
