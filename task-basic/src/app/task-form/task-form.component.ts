import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HasDirtyForm } from '../form-dirty-guard';
import { TaskStore } from '../store/task.store';
import { TaskFormStore } from './task-form.store';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TaskFormStore]
})
export class TaskFormComponent implements OnInit, HasDirtyForm {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly taskStore = inject(TaskStore);
  readonly formStore = inject(TaskFormStore);

  readonly formData = this.formStore.formData;
  readonly isEditing = this.formStore.isEditing;
  readonly isDirty = this.formStore.isDirty;

  async ngOnInit(): Promise<void> {
    if (this.taskStore.tasks().length === 0) {
      await this.taskStore.loadTasks();
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.formStore.resetForm();
      return;
    }

    const taskId = Number(idParam);
    const selectedTask = this.taskStore.taskById(taskId);
    if (selectedTask) {
      this.formStore.loadTaskForEdit(selectedTask);
      return;
    }

    this.formStore.resetForm();
  }

  onFieldChange(field: string, value: string | boolean): void {
    this.formStore.updateField(field, value);
  }

  async submitForm(): Promise<void> {
    await this.formStore.saveForm();
    this.router.navigateByUrl('/tasks');
  }

  canDeactivate(): boolean {
    return !this.formStore.isDirty() || confirm('You have unsaved changes. Leave anyway?');
  }
}
