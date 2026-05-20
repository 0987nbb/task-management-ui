import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';
import { HasDirtyForm } from '../form-dirty-guard';
import { loadTasks } from '../store/task.actions';
import { selectAllTasks } from '../store/task.selectors';
import { TaskFormStore } from './task-form.store';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskFormComponent implements OnInit, HasDirtyForm {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly rootStore = inject(Store);
  readonly formStore = inject(TaskFormStore);

  readonly formData = this.formStore.formData;
  readonly isEditing = this.formStore.isEditing;
  readonly isDirty = this.formStore.isDirty;

  ngOnInit(): void {
    this.rootStore.dispatch(loadTasks());

    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.formStore.resetForm();
      return;
    }

    const taskId = Number(idParam);
    const tasks = this.rootStore.selectSignal(selectAllTasks);
    const selectedTask = tasks().find((task) => task.id === taskId) ?? null;

    if (selectedTask) {
      this.formStore.loadTaskForEdit(selectedTask);
      return;
    }

    this.rootStore
      .select(selectAllTasks)
      .pipe(
        filter((taskList) => taskList.some((item) => item.id === taskId)),
        take(1)
      )
      .subscribe((taskList) => {
        const task = taskList.find((item) => item.id === taskId);
        if (task) {
          this.formStore.loadTaskForEdit(task);
        }
      });
  }

  onFieldChange(field: string, value: string | boolean): void {
    this.formStore.updateField(field, value);
  }

  submitForm(): void {
    this.formStore.saveForm();
    this.router.navigateByUrl('/tasks');
  }

  canDeactivate(): boolean {
    return !this.formStore.isDirty() || confirm('You have unsaved changes. Leave anyway?');
  }
}
