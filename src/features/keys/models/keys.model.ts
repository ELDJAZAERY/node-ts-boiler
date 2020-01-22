import { BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Partner } from '../../Partner';

export default class Key extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  key: string;

  @ManyToOne(
    () => Partner,
    partner => partner.keys,
    { eager: true, nullable: false }
  )
  partner: Partner;
}
