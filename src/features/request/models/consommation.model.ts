import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  Entity,
  OneToMany
} from 'typeorm';
import { Partner } from '../../Partner';

@Entity({ name: 'daily_consommations' })
export default class Consommation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  @Index({ unique: true })
  date: string; // day,month,year,partnerId

  @Column()
  day: number; // 1 --> 31

  @Column()
  month: number; // 1 --> 12

  @Column()
  year: number; // 2014

  @Column()
  cpt: number;

  @OneToMany(
    type => Partner,
    partner => partner.dailyConsommations,
    { nullable: false }
  )
  partner: Partner;

  constructor(partner: Partner) {
    super();

    this.partner = partner;

    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();
    const day = now.getUTCDate();

    this.date = day
      .toString()
      .concat(month.toString())
      .concat(year.toString())
      .concat(partner.id.toString());

    this.day = day;
    this.month = month;
    this.year = year;
    this.cpt = 0;
  }

  increment = async () => {
    this.cpt++;
    await this.save();
  };

  /**  UTC daily consomation counter of specific partner */
  static getDailyConsommations = async (
    partner: Partner,
    time: Date = new Date()
  ): Promise<number> => {
    const year = time.getUTCFullYear();
    const month = time.getUTCMonth();
    const day = time.getUTCDate();

    const date = day
      .toString()
      .concat(month.toString())
      .concat(year.toString())
      .concat(partner.id.toString());

    const consomm: Consommation | undefined = await Consommation.getRepository()
      .createQueryBuilder('consommation')
      .leftJoin('Consommation.partner', 'partner')
      .where('consommation.date = :date', { date })
      .andWhere('partner.id = :id', partner.id)
      .getOne();

    if (consomm) return consomm.cpt;

    return 0;
  };

  /**  UTC monthly consomation counter of specific partner */
  static getMonthlyConsommations = async (
    partner: Partner,
    date: Date = new Date()
  ): Promise<number> => {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();

    const consomm: Consommation[] = await Consommation.getRepository()
      .createQueryBuilder('consommation')
      .leftJoin('Consommation.partner', 'partner')
      .where('partner.id = :id', partner.id)
      .andWhere('consommation.year = :year AND consommation.month = :month ', {
        month,
        year
      })
      .getMany();

    let monthlyConsomm: number = 0;
    consomm.forEach(cons => {
      monthlyConsomm += cons.cpt;
    });

    return monthlyConsomm;
  };

  /**  UTC yearly consomation counter of specific partner */
  static getYearlyConsommations = async (
    partner: Partner,
    date: Date = new Date()
  ): Promise<number> => {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();

    const consomm: Consommation[] = await Consommation.getRepository()
      .createQueryBuilder('consommation')
      .leftJoin('Consommation.partner', 'partner')
      .where('partner.id = :id', partner.id)
      .andWhere('consommation.year = :year', {
        month,
        year
      })
      .getMany();

    let monthlyConsomm: number = 0;
    consomm.forEach(cons => {
      monthlyConsomm += cons.cpt;
    });

    return monthlyConsomm;
  };

  /** get the current UTC daily consommatoin */
  static getCurrentConsomation = async (
    partner: Partner
  ): Promise<Consommation> => {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();
    const day = now.getUTCDate();

    const date = day
      .toString()
      .concat(month.toString())
      .concat(year.toString())
      .concat(partner.id.toString());

    const consomm: Consommation | undefined = await Consommation.getRepository()
      .createQueryBuilder('consommation')
      .leftJoin('Consommation.partner', 'partner')
      .where('consommation.date = :date', { date })
      .andWhere('partner.id = :id', partner.id)
      .getOne();

    if (consomm) return consomm;

    const newDailyConsomm = new Consommation(partner);
    await newDailyConsomm.save();

    return newDailyConsomm;
  };
}
