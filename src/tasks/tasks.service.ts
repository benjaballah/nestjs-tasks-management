import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './interface/task.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './repository/task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './entity/task.entity';
import { UserEntity } from 'src/auth/entity/user.entity';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) { }

    async getTasks(filterDto: GetTasksFilterDto, user: UserEntity): Promise<TaskEntity[]> {
        return this.taskRepository.getTasks(filterDto, user);
    }

    async getTaskById(id: number, user: UserEntity): Promise<TaskEntity> {
        const found = await this.taskRepository.findOne({ where: { id, userId: user.id } })

        if (!found) {
            throw new NotFoundException('TASK_NOT_FOUND');
        }

        return found;
    }

    createTask(createTaskDto: CreateTaskDto, user: UserEntity): Promise<TaskEntity> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async deleteTask(id: number, user: UserEntity): Promise<boolean> {
        const result = await this.taskRepository.delete({ id, userId: user.id });

        return result.affected > 0;
    }

    async updateTaskStatus(id: number, status: TaskStatus, user: UserEntity): Promise<TaskEntity> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        await task.save();
        return task;
    }
}
