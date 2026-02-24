import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from '../../../../modules/auth/entities/auth.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class GreetingService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly mailerService: MailerService,
  ) {}

  // Helper to format today's month/day for SQLite comparison
  private getTodayStrings() {
    const now = new Date();
    return {
      month: (now.getMonth() + 1).toString().padStart(2, '0'), // '09'
      day: now.getDate().toString().padStart(2, '0'),         // '24'
      year: now.getFullYear(),
    };
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleBirthdays() {
    const { month, day } = this.getTodayStrings();

    const birthdays = await this.authRepository.createQueryBuilder('auth')
      .innerJoinAndSelect('auth.user', 'user')
      .where('auth.isEnabled = :enabled', { enabled: 1 }) // SQLite uses 1 for true
      .andWhere("strftime('%m', user.dateOfBirth) = :month", { month })
      .andWhere("strftime('%d', user.dateOfBirth) = :day", { day })
      .getMany();

    for (const auth of birthdays) {
      await this.mailerService.sendMail({
        to: auth.email,
        subject: `Happy Birthday, ${auth.user.firstName}! 🎂`,
        template: 'birthday',
        context: { name: auth.user.firstName, logoUrl: '...' },
      });
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async handleAnniversaries() {
    const { month, day, year } = this.getTodayStrings();

    const anniversaries = await this.authRepository.createQueryBuilder('auth')
      .innerJoinAndSelect('auth.user', 'user')
      .where('auth.isEnabled = :enabled', { enabled: 1 })
      .andWhere("strftime('%m', user.createdAt) = :month", { month })
      .andWhere("strftime('%d', user.createdAt) = :day", { day })
      .andWhere("CAST(strftime('%Y', user.createdAt) AS INTEGER) < :year", { year })
      .getMany();

    for (const auth of anniversaries) {
      const joinYear = new Date(auth.user.createdAt).getFullYear();
      await this.mailerService.sendMail({
        to: auth.email,
        subject: 'Happy Work Anniversary! 🎊',
        template: 'anniversary',
        context: { 
          name: auth.user.firstName, 
          yearsCount: year - joinYear 
        },
      });
    }
  }
}
