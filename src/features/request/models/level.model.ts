import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Entity
} from 'typeorm';
import RequestType from './request.type.model';
import CreateLevelDTO from '../dto/create.level.dto';
import UpdateLevelDTO from '../dto/update.level.dto';

@Entity()
export default class Level extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  from: number;

  @Column()
  to: number;

  @Column()
  price: number;

  @ManyToOne(
    () => RequestType,
    requestType => requestType.levels,
    { eager: true, nullable: false }
  )
  type: RequestType;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  constructor(createLevelDTO: CreateLevelDTO, type: RequestType) {
    super();
    const { from, to, price } = createLevelDTO;
    this.from = from;
    this.to = to;
    this.price = price;
    this.type = type;
  }

  update = async (
    updateLevelDTO: UpdateLevelDTO,
    type: RequestType
  ): Promise<Level> => {
    const { from, to, price } = updateLevelDTO;
    this.from = from;
    this.to = to;
    this.price = price;
    this.type = type;

    const updated: Level = await this.save();
    return updated;
  };
}
