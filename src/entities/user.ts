import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Document } from 'mongoose';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;
}
