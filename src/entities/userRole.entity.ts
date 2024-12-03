import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'

import { Role } from './role.entity'
import { User } from './user.entity'

@Entity('User_Role')
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Role, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role: Role

  @Column('datetime')
  createdAt: Date

  @Column('datetime')
  updatedAt: Date
}
