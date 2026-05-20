import { inject, linkedSignal } from '@angular/core';
import {
  patchState,
  signalStore,
  watchState,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState
} from '@ngrx/signals';
import { connectSignalDevtools } from '../store/signal-devtools';
import { Task } from '../store/task.model';
import { TaskStore } from '../store/task.store';

interface TaskFormState {
  selectedTask: Task | null;
  isEditing: boolean;
  isDirty: boolean;
}

interface TaskFormData {
  title: string;
  completed: boolean;
}

const initialTaskFormState: TaskFormState = {
  selectedTask: null,
  isEditing: false,
  isDirty: false
};

const emptyFormData: TaskFormData = {
  title: '',
  completed: false
};

export const TaskFormStore = signalStore(
  withState(initialTaskFormState),
  withProps(() => ({
    _originalTaskData: linkedSignal(() => null as TaskFormData | null),
    _devtools: connectSignalDevtools('TaskFormStore')
  })),
  withComputed(({ selectedTask }) => ({
    formData: linkedSignal(() => ({
      title: selectedTask()?.title ?? '',
      completed: selectedTask()?.completed ?? false
    }))
  })),
  withMethods((store, taskStore = inject(TaskStore)) => ({
    loadTaskForEdit(task: Task): void {
      const original: TaskFormData = {
        title: task.title,
        completed: task.completed
      };

      store._originalTaskData.set(original);
      patchState(store, {
        selectedTask: task,
        isEditing: true,
        isDirty: false
      });
      store.formData.set({ ...original });
    },
    updateField(field: string, value: string | boolean): void {
      store.formData.update((current) => ({ ...current, [field]: value }));
      const current = store.formData();
      const original = store._originalTaskData();

      const isDirty = original
        ? current.title !== original.title || current.completed !== original.completed
        : current.title.trim().length > 0 || current.completed;

      patchState(store, { isDirty });
    },
    async saveForm(): Promise<void> {
      const data = store.formData();
      const title = data.title.trim();
      if (!title) {
        return;
      }

      if (store.isEditing() && store.selectedTask()) {
        await taskStore.updateTask(store.selectedTask()!.id, title, data.completed);
      } else {
        await taskStore.addTask(title);
      }

      patchState(store, { isDirty: false });
      store._originalTaskData.set({
        title,
        completed: data.completed
      });
    },
    resetForm(): void {
      store._originalTaskData.set(null);
      patchState(store, {
        selectedTask: null,
        isEditing: false,
        isDirty: false
      });
      store.formData.set({ ...emptyFormData });
    }
  })),
  withHooks({
    onInit(store) {
      store._devtools?.init({
        selectedTask: store.selectedTask(),
        isEditing: store.isEditing(),
        isDirty: store.isDirty(),
        formData: store.formData()
      });
      watchState(store, (state) => {
        store._devtools?.send('TaskFormStore state update', state);
      });
    }
  })
);
