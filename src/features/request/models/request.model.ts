import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  Entity
} from 'typeorm';
import RequestType from './request.type.model';
import { Partner } from '../../Partner';

Entity();
export default class GISRequest extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

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

  constructor(
    latitude: number,
    longitude: number,
    type: RequestType,
    partner: Partner
  ) {
    super();
    this.latitude = latitude;
    this.longitude = longitude;
    this.type = type;
    this.partner = partner;
  }
}
