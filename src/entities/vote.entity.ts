import { User } from './user.entity'
import { Post } from './post.entity'
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'

@Entity('votes')
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('int')
  value: number

  @ManyToOne(() => User, (user) => user.votes)
  user: User

  @ManyToOne(() => Post, (post) => post.votes)
  post: Post
}
