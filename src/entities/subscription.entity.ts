import { User } from './user.entity'
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm'
import { SubscriptionType } from '@/enums/subscription-type.enum'

@Entity('Subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('datetime')
  startDate: Date

  @Column('datetime', { nullable: true })
  endDate: Date

  @Column({
    type: 'enum',
    enum: SubscriptionType
  })
  type: SubscriptionType

  @Column('decimal', { precision: 10, scale: 2 })
  price: number

  @ManyToOne(() => User, (user) => user.subscriptions)
  user: User
}
