import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'

import { Role } from './role.entity'
@Entity('Permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text')
  name: string

  @Column('datetime')
  createdAt: Date

  @Column('datetime')
  updatedAt: Date

  @ManyToOne(() => Role, (role) => role.permissions, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  roles: Role
}
