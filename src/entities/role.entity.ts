import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'

import { Permission } from './permission.entity'
import { User } from './user.entity'
@Entity('Roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text', { nullable: false })
  name: string

  @Column('datetime', { nullable: false })
  createdAt: Date

  @Column('datetime', { nullable: false })
  updatedAt: Date

  //   TODO: check if the following code is necessary
  @OneToMany(() => User, (user) => user.role_id)
  users: User[]

  @OneToMany(() => Permission, (permission) => permission.roles)
  permissions: Permission[]
}
