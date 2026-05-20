import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TaskListComponent } from './task-list/task-list.component';

@Component({
  selector: 'app-root',
  imports: [TaskListComponent],
  template: '<app-task-list />',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {}
