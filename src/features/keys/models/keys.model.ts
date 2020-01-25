import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Entity,
  Index
} from 'typeorm';
import { Partner } from '../../Partner';

@Entity()
export default class Key extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  @Index({ unique: true })
  key: string;

  @ManyToOne(
    () => Partner,
    partner => partner.keys,
    { eager: true, nullable: false }
  )
  partner: Partner;

  constructor(key: string, partner: Partner) {
    super();
    this.key = key;
    this.partner = partner;
  }

  update = async (key: string): Promise<Key> => {
    this.key = key;
    const updated: Key = await this.save();
    return updated;
  };
}
