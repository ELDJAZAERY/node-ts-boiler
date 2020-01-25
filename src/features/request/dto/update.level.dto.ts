import CreateLevelDTO from './create.level.dto';
import { IsUUID } from 'class-validator';

export default class UpdateLevelDTO extends CreateLevelDTO {
  @IsUUID()
  id: string;
}
