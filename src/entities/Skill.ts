import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import { Upvote } from './Upvote';

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Upvote,(upvote) => upvote.skill)
  upvote: Upvote[];
}
