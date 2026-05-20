import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { addTask, deleteTask, loadTasks, toggleTask } from '../store/task.actions';
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

  readonly tasks = this.store.selectSignal(selectAllTasks);
  readonly stats = this.store.selectSignal(selectTaskStats);
  readonly loading = this.store.selectSignal(selectTaskLoading);
  readonly error = this.store.selectSignal(selectTaskError);

  ngOnInit(): void {
    this.store.dispatch(loadTasks());
  }

  addTask(): void {
    if (this.loading()) {
      return;
    }

    const title = prompt('Enter task title');
    if (title) {
      this.store.dispatch(addTask({ title }));
    }
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
}
