import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { TaskStatus } from './interface/task.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipes';
import { TaskEntity } from './entity/task.entity';
import { GetUserDecorator } from 'src/auth/decorator/get-user.decorator';
import { UserEntity } from 'src/auth/entity/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');

    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTasksFilterDto,
        @GetUserDecorator() user: UserEntity,
    ): Promise<TaskEntity[]> {
        this.logger.verbose(`[getTask] userId ${user.id}, Filter ${JSON.stringify(GetTasksFilterDto)}`);
        return this.tasksService.getTasks(filterDto, user);
    }

    @Get('/:id')
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUserDecorator() user: UserEntity,
    ): Promise<TaskEntity> {
        this.logger.verbose(`[getTaskById] userId ${user.id}, id ${id}`);
        return this.tasksService.getTaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUserDecorator() user: UserEntity,
    ): Promise<TaskEntity> {
        this.logger.verbose(`[createTask] userId ${user.id}, object ${JSON.stringify(CreateTaskDto)}`);
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Delete('/:id')
    deleteTask(
        @Param('id', ParseIntPipe) id: number,
        @GetUserDecorator() user: UserEntity,
    ): Promise<boolean> {
        this.logger.verbose(`[deleteTask] userId ${user.id}, id ${id}`);
        return this.tasksService.deleteTask(id, user);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUserDecorator() user: UserEntity,
    ): Promise<TaskEntity> {
        this.logger.verbose(`[updateTaskStatus] userId ${user.id}, id ${id}, status ${status}`);
        return this.tasksService.updateTaskStatus(id, status, user);
    }
}
