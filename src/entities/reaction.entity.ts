import { User } from './user.entity'
import { Comment } from './comment.entity'
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'

@Entity('Reactions')
export class Reaction {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('int')
  value: number

  @ManyToOne(() => User, (user) => user.reactions)
  user: User

  @ManyToOne(() => Comment, (comment) => comment.reactions)
  comment: Comment
}
