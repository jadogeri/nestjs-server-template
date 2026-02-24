import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from '../../../../modules/auth/entities/auth.entity';
import { EventEmitter2 } from '@nestjs/event-emitter'; 

@Injectable()
export class GreetingService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly eventEmitter: EventEmitter2, // For emitting events
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
  

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleBirthdays() {
    console.log('Birthday greeting task is currently active..................');
    const { month, day } = this.getTodayStrings();

    const birthdays = await this.authRepository.createQueryBuilder('auth')
      .innerJoinAndSelect('auth.user', 'user')
      .where('auth.isEnabled = :enabled', { enabled: 1 }) // SQLite uses 1 for true
      .andWhere("strftime('%m', user.dateOfBirth) = :month", { month })
      .andWhere("strftime('%d', user.dateOfBirth) = :day", { day })
      .getMany();

      console.log(`Found ${birthdays.length} birthdays today.`);
      console.log('Birthday records:', birthdays.map(b => ({ email: b.email, name: b.user.firstName }))); 

    for (const auth of birthdays) {
      console.log(`Emitting birthday event for ${auth.email}`);
      this.eventEmitter.emit('greetings.birthday', auth);
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
      this.eventEmitter.emit('greetings.anniversary', auth, year - joinYear);
    }
  }
}

