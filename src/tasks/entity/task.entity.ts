import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { TaskStatus } from "../interface/task.enum";
import { UserEntity } from "src/auth/entity/user.entity";

@Entity({name: 'task'})
export class TaskEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: TaskStatus;

    @ManyToOne(type => UserEntity, user => user.tasks, { eager: false })
    user: UserEntity

    @Column()
    userId: number
}
