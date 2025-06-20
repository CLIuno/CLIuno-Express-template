import { Role } from './role.entity'
import { Post } from './post.entity'
import { Vote } from './vote.entity'
import { Comment } from './comment.entity'
import { Exclude } from 'class-transformer'
import { Gender } from '@/enums/gender.enum'
import { Reaction } from './reaction.entity'
import { Follow } from './followSystem.entity'
import { Subscription } from './subscription.entity'
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm'

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text', { unique: true })
  username: string

  @Column('text')
  first_name: string

  @Column('text')
  last_name: string

  @Column('text', { nullable: true })
  date_of_birth: string

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true
  })
  gender: Gender

  @Column('text', { nullable: true })
  nationality: string

  @Column('text', { unique: true })
  phone: string

  @Column('text', { unique: true })
  email: string

  @Column('text')
  @Exclude()
  password: string

  @Column({ type: 'boolean', default: false })
  is_online: boolean

  @Column({ type: 'boolean', default: false })
  is_verified: boolean

  @Column({ type: 'boolean', default: false })
  is_otp_enabled: boolean

  @Column({ type: 'boolean', default: false })
  is_otp_verified: boolean

  @Column('text', { nullable: true })
  otp_base32: string

  @Column('text', { nullable: true })
  otp_auth_url: string

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean

  @Column('datetime')
  createdAt: Date

  @Column('datetime')
  updatedAt: Date

  @Column('datetime', { nullable: true })
  deletedAt: Date

  @ManyToOne(() => Role, (role) => role.users, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role_id: Role

  @OneToMany(() => Post, (post) => post.user_id)
  posts: Post[]

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[]

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[]

  @OneToMany(() => Reaction, (reaction) => reaction.user)
  reactions: Reaction[]

  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[]

  @OneToMany(() => Follow, (follow) => follow.following)
  followers: Follow[]

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[]
}
