import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// 1. Define the Enum
export enum StatusEnum {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  LOCKED = 'locked',
}
