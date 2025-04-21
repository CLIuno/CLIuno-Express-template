import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('blacklisted_tokens')
export class BlacklistedToken {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text')
  token: string | undefined

  @Column('text')
  invalidatedAt: Date
}
