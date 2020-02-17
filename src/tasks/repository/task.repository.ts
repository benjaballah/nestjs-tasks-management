import { Repository, EntityRepository } from "typeorm";
import { TaskEntity } from "../entity/task.entity";
import { CreateTaskDto } from "../dto/create-task.dto";
import { TaskStatus } from "../interface/task.enum";
import { GetTasksFilterDto } from "../dto/get-tasks-filter.dto";

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {

    async getTasks(filterDto: GetTasksFilterDto): Promise<TaskEntity[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
        }

        const tasks = await query.getMany();
        return tasks;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
        const task = new TaskEntity()

        task.title = createTaskDto.title;
        task.description = createTaskDto.description;
        task.status = TaskStatus.OPEN;

        await task.save();

        return task;
    }

}
