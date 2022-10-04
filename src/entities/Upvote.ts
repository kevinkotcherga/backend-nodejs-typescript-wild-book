import {Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import { Skill } from './Skill';
import { Wilder } from './Wilder';

@Entity()
@Index(["wilder", "skill"], {unique: true})
export class Upvote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: 0})
  upvote: number;

  @ManyToOne(() => Skill,(skill) => skill.upvote)
  skill: Skill;

  @ManyToOne(() => Wilder,(wilder) => wilder.upvote, {onDelete: "CASCADE"})
  wilder: Wilder;
}
