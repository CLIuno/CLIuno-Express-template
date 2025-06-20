import { User } from './user.entity'
import { Vote } from './vote.entity'
import { Comment } from './comment.entity'
import { Category } from './category.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinColumn
} from 'typeorm'

@Entity('Posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text')
  title: string

  @Column('text')
  content: string

  @Column('text')
  imageUrl: string

  @Column('datetime')
  createdAt: Date

  @Column('datetime')
  updatedAt: Date

  @Column({ type: 'boolean', default: false })
  is_paid: boolean

  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user_id: User

  @ManyToMany(() => Category, (category) => category.posts, { nullable: true })
  categories: Category[]

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[]

  @OneToMany(() => Vote, (vote) => vote.post)
  votes: Vote[]
}
