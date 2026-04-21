import { Injectable } from '@nestjs/common';
import { ChecklistRepositoryService } from './checklist.repository.service';
import {
  ChecklistViewModel,
  CreateTaskRequest,
} from '../types/checklist/checklist.dto';

@Injectable()
export class ChecklistService {
  constructor(
    private readonly checklistRepository: ChecklistRepositoryService,
  ) {}

  public async createTask(userId: number, request: CreateTaskRequest) {
    return await this.checklistRepository.createTask({
      userId,
      task: request.task,
      timeframe: request.timeframe,
    });
  }

  public async deleteTask(taskId: number) {
    await this.checklistRepository.deleteTask(taskId);
  }

  public async getAllTasks(userId: number): Promise<ChecklistViewModel> {
    const tasks = await this.checklistRepository.getAllTasks(userId);
    return {
      result: tasks.map((t) => ({
        id: t.id,
        task: t.task,
        isChecked: t.isChecked,
        timeframe: t.timeframe,
      })),
    };
  }

  public async toggleTask(taskId: number) {
    await this.checklistRepository.toggleTask(taskId);
  }
}
