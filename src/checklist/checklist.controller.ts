import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChecklistService } from './checklist.service';
import { User } from '../decorators/user.decorator';
import { CurrentUser } from '../types/auth/auth.dto';
import {
  ChecklistViewModel,
  CreateTaskRequest,
  DeleteTaskRequest,
  ToggleTaskRequest,
} from '../types/checklist/checklist.dto';

@Controller('checklist')
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Get('getAllTasks')
  public async getAllTasks(
    @User() user: CurrentUser,
  ): Promise<ChecklistViewModel> {
    return await this.checklistService.getAllTasks(user.id);
  }

  @Post('createTask')
  public async createTask(
    @User() user: CurrentUser,
    @Body() request: CreateTaskRequest,
  ): Promise<void> {
    await this.checklistService.createTask(user.id, request);
  }

  @Post('deleteTask')
  public async deleteTask(@Body() request: DeleteTaskRequest): Promise<void> {
    await this.checklistService.deleteTask(request.taskId);
  }

  @Post('toggleTask')
  public async toggleTask(@Body() request: ToggleTaskRequest): Promise<void> {
    await this.checklistService.toggleTask(request.taskId, request.isChecked);
  }
}
