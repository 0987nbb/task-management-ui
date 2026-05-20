import { Routes } from '@angular/router';
import { formDirtyGuard } from './form-dirty-guard';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskListComponent } from './task-list/task-list.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tasks' },
  { path: 'tasks', component: TaskListComponent },
  {
    path: 'tasks/new',
    component: TaskFormComponent,
    canDeactivate: [formDirtyGuard]
  },
  {
    path: 'tasks/:id/edit',
    component: TaskFormComponent,
    canDeactivate: [formDirtyGuard]
  }
];
