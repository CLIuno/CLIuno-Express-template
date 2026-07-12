import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm'

import { User } from './user.entity'
import { Comment } from './comment.entity'

@Entity('Posts')
export class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text')
    title: string

    @Column('text')
    content: string

    @Column('text', { nullable: true })
    imageUrl: string | null

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @Column({ type: 'boolean', default: false })
    is_paid: boolean

    @ManyToOne(() => User, (user) => user.posts, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[]
}