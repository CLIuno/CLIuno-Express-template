import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm'

import { User } from './user.entity'
import { Post } from './post.entity'

@Entity('Comments')
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text')
    content: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(() => User, (user) => user.comments, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User

    @ManyToOne(() => Post, (post) => post.comments, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post: Post
}