import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'

import { Post } from './post.entity'
import { User } from './user.entity'

@Entity('Comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  content: string

  @ManyToOne(() => User, (user) => user.comments)
  user: User

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post
}
