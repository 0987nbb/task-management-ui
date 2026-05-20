import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TaskStore } from '../store/task.store';

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent implements OnInit {
  private readonly taskStore = inject(TaskStore);
  private readonly router = inject(Router);

  readonly tasks = this.taskStore.tasks;
  readonly stats = this.taskStore.stats;
  readonly loading = this.taskStore.loading;
  readonly error = this.taskStore.error;

  ngOnInit(): void {
    void this.taskStore.loadTasks();
  }

  addTask(): void {
    this.router.navigateByUrl('/tasks/new');
  }

  toggleTask(id: number): void {
    if (this.loading()) {
      return;
    }

    void this.taskStore.toggleTask(id);
  }

  deleteTask(id: number): void {
    if (this.loading()) {
      return;
    }

    void this.taskStore.deleteTask(id);
  }

  editTask(id: number): void {
    this.router.navigateByUrl(`/tasks/${id}/edit`);
  }
}
