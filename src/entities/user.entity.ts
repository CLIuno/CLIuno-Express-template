import { Exclude } from "class-transformer";
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

import { Role } from "./role.entity";
import { Post } from "./post.entity";

@Entity("Users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("text", { unique: true })
    username: string;

    @Column("text")
    first_name: string;

    @Column("text")
    last_name: string;

    @Column("text", { nullable: true })
    date_of_birth: string;

    @Column("text", { nullable: true })
    gender: string;

    @Column("text", { nullable: true })
    nationality: string;

    @Column("text", { unique: true })
    phone: string;

    @Column("text", { unique: true })
    email: string;

    @Column("text")
    @Exclude()
    password: string;

    @Column({ type: "boolean", default: false })
    is_online: boolean;

    @Column({ type: "boolean", default: false })
    is_verified: boolean;

    @Column({ type: "boolean", default: false })
    is_otp_enabled: boolean;

    @Column({ type: "boolean", default: false })
    is_otp_verified: boolean;

    @Column("text", { nullable: true })
    @Exclude()
    otp_base32: string;

    @Column("text", { nullable: true })
    @Exclude()
    otp_auth_url: string;

    @Column("text", { nullable: true })
    @Exclude()
    refresh_token: string;

    @Column({ type: "boolean", default: false })
    @Exclude()
    is_deleted: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column("datetime", { nullable: true })
    @Exclude()
    deletedAt: Date;

    @ManyToOne(() => Role, { nullable: false })
    @JoinColumn({ name: "role_id" })
    role: Role;

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];
}
