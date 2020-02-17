import { PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../interface/task.enum";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE
    ];

    transform(value: any, metadata: ArgumentMetadata) {
        if (!value || typeof value !== 'string') {
            throw new BadRequestException(`"${value}" is an invalid status`)
        }
        
        value = value.toUpperCase();

        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`"${value}" is an invalid status`);
        }

        return value;
    }

    private isStatusValid(status: any) {
        const index = this.allowedStatuses.indexOf(status);

        return index !== -1;
    }
}