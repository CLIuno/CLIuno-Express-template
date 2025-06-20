import { User } from './user.entity'
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm'

@Entity('Follows')
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('datetime')
  createdAt: Date

  @Column('datetime')
  updatedAt: Date

  @ManyToOne(() => User, (user) => user.following)
  follower: User

  @ManyToOne(() => User, (user) => user.followers)
  following: User
}
