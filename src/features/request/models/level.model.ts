import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import RequestType from './request.type.model';

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
}
