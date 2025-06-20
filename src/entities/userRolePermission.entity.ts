import { User } from './user.entity'
import { Role } from './role.entity'
import { Permission } from './permission.entity'
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
@Entity('User_Role_Permission')
export class UserRolePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Role, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role: Role

  @ManyToOne(() => Permission, { nullable: false })
  @JoinColumn({ name: 'permission_id' })
  permission: Permission

  @Column('datetime')
  createdAt: Date

  @Column('datetime')
  updatedAt: Date
}
