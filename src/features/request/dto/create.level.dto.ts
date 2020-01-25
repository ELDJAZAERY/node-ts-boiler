import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ValidateIf,
  IsString
} from 'class-validator';

export default class CreateLevelDTO {
  @IsNumber()
  @IsPositive()
  from: number;

  @IsNumber()
  @IsPositive()
  @ValidateIf(levelDTO => levelDTO.from < levelDTO.to)
  to: number;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  @IsNotEmpty()
  type: string;
}
