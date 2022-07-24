import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('profile')
export class Profile {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  first_name: string;

  @Column({ default: '' })
  last_name: string;

  @Column()
  phone?: string;

  @Column()
  email?: string;
}
