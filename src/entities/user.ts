import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 16 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password?: string;

  @OneToOne(() => Profile, { cascade: true })
  @JoinColumn({ name: 'pid' })
  profile: Profile;
}
