import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user';

@Entity('profile')
export class Profile {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ default: '' })
  first_name: string;

  @Column({ default: '' })
  last_name: string;

  @Column({ default: '' })
  full_name: string;

  @Column()
  phone?: string;

  @Column()
  email?: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
