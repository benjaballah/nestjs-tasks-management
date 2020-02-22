import { Repository, EntityRepository } from "typeorm";
import { TaskEntity } from "../entity/task.entity";
import { CreateTaskDto } from "../dto/create-task.dto";
import { TaskStatus } from "../interface/task.enum";
import { GetTasksFilterDto } from "../dto/get-tasks-filter.dto";
import { UserEntity } from "src/auth/entity/user.entity";

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {

    async getTasks(filterDto: GetTasksFilterDto, user: UserEntity): Promise<TaskEntity[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');

        query.where('task.userId = :userId', { userId: user.id })

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
        }

        const tasks = await query.getMany();
        return tasks;
    }

    async createTask(createTaskDto: CreateTaskDto, user: UserEntity): Promise<TaskEntity> {
        const task = new TaskEntity()

        task.title = createTaskDto.title;
        task.description = createTaskDto.description;
        task.status = TaskStatus.OPEN;
        task.user = user;

        await task.save();

        delete task.user;

        return task;
    }

}
