import { Post } from './post.entity'
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm'

@Entity('Categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text')
  name: string

  @Column('text')
  description: string

  @Column('datetime')
  createdAt: Date

  @Column('datetime')
  updatedAt: Date

  @ManyToMany(() => Post, (post) => post.categories)
  @JoinTable()
  posts: Post[]
}
