import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { TaskStatus } from './interface/task.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './repository/task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './entity/task.entity';
import { UserEntity } from 'src/auth/entity/user.entity';

@Injectable()
export class TasksService {
    private logger = new Logger('TasksService');

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) { }

    async getTasks(filterDto: GetTasksFilterDto, user: UserEntity): Promise<TaskEntity[]> {
        return this.taskRepository.getTasks(filterDto, user);
    }

    async getTaskById(id: number, user: UserEntity): Promise<TaskEntity> {
        try {
            const found = await this.taskRepository.findOne({ where: { id, userId: user.id } })

            if (!found) {
                throw new NotFoundException('TASK_NOT_FOUND');
            }

            return found;
        } catch (error) {
            this.logger.error(`[getTaskById] id: ${id}, userId: ${user.id}`, error.stack);
            throw new InternalServerErrorException();
        }

    }

    createTask(createTaskDto: CreateTaskDto, user: UserEntity): Promise<TaskEntity> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async deleteTask(id: number, user: UserEntity): Promise<boolean> {
        try {
            const result = await this.taskRepository.delete({ id, userId: user.id });

            return result.affected > 0;
        } catch (error) {
            this.logger.error(`[deleteTask] id: ${id}, userId: ${user.id}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async updateTaskStatus(id: number, status: TaskStatus, user: UserEntity): Promise<TaskEntity> {
        try {
            const task = await this.getTaskById(id, user);
            task.status = status;

            await task.save();

            return task;
        } catch (error) {
            this.logger.error(`[updateTaskStatus] id: ${id}, status: ${status}, userId: ${user.id}`, error.stack);
            throw new InternalServerErrorException();
        }
    }
}
