import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from "typeorm";
import * as bcrypt from "bcrypt";
import { TaskEntity } from "src/tasks/entity/task.entity";
import { InternalServerErrorException, Logger } from "@nestjs/common";

@Entity('user')
@Unique(['username'])
export class UserEntity extends BaseEntity {
    private logger = new Logger('UserEntity');

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @OneToMany(type => TaskEntity, task => task.user, { eager: true })
    tasks: TaskEntity[]

    async validatePassword(password: string): Promise<boolean> {
        try {
            const hash = await bcrypt.hash(password, this.salt);

            return hash === this.password;
        } catch (error) {
            this.logger.error(`[validatePassword] username ${this.username}, password ${password}`, error.stack)
            throw new InternalServerErrorException();
        }
    }
}
