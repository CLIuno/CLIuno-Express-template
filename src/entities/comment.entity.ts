import { User } from './user.entity'
import { Post } from './post.entity'
import { Reaction } from './reaction.entity'
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm'

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

  @OneToMany(() => Reaction, (reaction) => reaction.comment)
  reactions: Reaction[]
}
