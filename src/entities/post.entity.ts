import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'

import { User } from './user.entity'

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
}
