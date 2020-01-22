import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import Level from './level.model';
import Request from './request.model';

export default class RequestType extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @OneToMany(
    type => Level,
    level => level.type
  )
  levels: Level[];

  @OneToMany(
    type => Request,
    request => request.type
  )
  requests: Request[];

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;
}
