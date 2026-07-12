import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Unique,
} from 'typeorm'

import { User } from './user.entity'

@Entity('Follows')
@Unique(['follower', 'following'])
export class Follow {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => User, (user) => user.following, { nullable: false })
    @JoinColumn({ name: 'follower_id' })
    follower: User

    @ManyToOne(() => User, (user) => user.followers, { nullable: false })
    @JoinColumn({ name: 'following_id' })
    following: User

    @CreateDateColumn()
    createdAt: Date
}