import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  Index
} from 'typeorm';
import Level from './level.model';
import GISRequest from './request.model';
import CreateTypeDTO from '../dto/create.type.dto';
import UpdateTypeDTO from '../dto/update.type.dto';

@Entity({ name: 'request_type' })
export default class RequestType extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  @Index({ unique: true })
  type: string;

  @OneToMany(
    type => Level,
    level => level.type
  )
  levels: Level[];

  @OneToMany(
    type => GISRequest,
    request => request.type
  )
  requests: GISRequest[];

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  constructor(createType: CreateTypeDTO) {
    super();
    this.type = createType.type;
  }

  update = async (updateTypeDTO: UpdateTypeDTO): Promise<RequestType> => {
    this.type = updateTypeDTO.newType;
    const updated: RequestType = await this.save();
    return updated;
  };
}
