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

@Entity('Todos')
export class Todo {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text')
    title: string

    @Column('text', { nullable: true })
    description: string

    @Column({ type: 'boolean', default: false })
    is_completed: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(() => User, (user) => user.todos, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User
}