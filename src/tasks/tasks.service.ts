import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './interface/task.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './repository/task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './entity/task.entity';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) { }

    async getTasks(filterDto: GetTasksFilterDto): Promise<TaskEntity[]> {
        return this.taskRepository.getTasks(filterDto);
    }

    async getTaskById(id: number): Promise<TaskEntity> {
        const found = await this.taskRepository.findOne(id)

        if (!found) {
            throw new NotFoundException('TASK_NOT_FOUND');
        }

        return found;
    }

    createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
        return this.taskRepository.createTask(createTaskDto);
    }

    async deleteTask(id: number): Promise<boolean> {
        const result = await this.taskRepository.delete(id);

        return result.affected > 0;
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<TaskEntity> {
        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;
    }
}
