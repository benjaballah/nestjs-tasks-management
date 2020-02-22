import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
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
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTasksFilterDto,
        @GetUserDecorator() user: UserEntity,
    ): Promise<TaskEntity[]> {
        return this.tasksService.getTasks(filterDto, user);
    }

    @Get('/:id')
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUserDecorator() user: UserEntity,
    ): Promise<TaskEntity> {
        return this.tasksService.getTaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUserDecorator() user: UserEntity,
    ): Promise<TaskEntity> {
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Delete('/:id')
    deleteTask(
        @Param('id', ParseIntPipe) id: number,
        @GetUserDecorator() user: UserEntity,
    ): Promise<boolean> {
        return this.tasksService.deleteTask(id, user);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUserDecorator() user: UserEntity,
    ): Promise<TaskEntity> {
        return this.tasksService.updateTaskStatus(id, status, user);
    }
}
