import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { deleteTask, loadTasks, toggleTask } from '../store/task.actions';
import {
  selectAllTasks,
  selectTaskError,
  selectTaskLoading,
  selectTaskStats
} from '../store/task.selectors';

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly tasks = this.store.selectSignal(selectAllTasks);
  readonly stats = this.store.selectSignal(selectTaskStats);
  readonly loading = this.store.selectSignal(selectTaskLoading);
  readonly error = this.store.selectSignal(selectTaskError);

  ngOnInit(): void {
    this.store.dispatch(loadTasks());
  }

  addTask(): void {
    this.router.navigateByUrl('/tasks/new');
  }

  toggleTask(id: number): void {
    if (this.loading()) {
      return;
    }

    this.store.dispatch(toggleTask({ id }));
  }

  deleteTask(id: number): void {
    if (this.loading()) {
      return;
    }

    this.store.dispatch(deleteTask({ id }));
  }

  editTask(id: number): void {
    this.router.navigateByUrl(`/tasks/${id}/edit`);
  }
}
