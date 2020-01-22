import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne
} from 'typeorm';
import RequestType from './request.type.model';
import { Partner } from '../../Partner';

export default class Request extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: Date })
  date: Date;

  @Column()
  latitude: number;

  @Column()
  logitude: number;

  @ManyToOne(
    () => RequestType,
    requestType => requestType.levels,
    { eager: true, nullable: false }
  )
  type: RequestType;

  @ManyToOne(
    () => Partner,
    partner => partner.requests,
    { eager: true, nullable: false }
  )
  partner: Partner;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;
}
