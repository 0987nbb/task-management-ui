import { linkedSignal } from '@angular/core';
import {
  patchState,
  signalStore,
  signalStoreFeature,
  watchState,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState
} from '@ngrx/signals';
import { Store } from '@ngrx/store';
import { Injectable, inject } from '@angular/core';
import { addTask, updateTask } from '../store/task.actions';
import { Task } from '../store/task.model';

interface TaskFormState {
  selectedTask: Task | null;
  isEditing: boolean;
  isDirty: boolean;
}

interface TaskFormData {
  title: string;
  completed: boolean;
}

function withLogging() {
  return signalStoreFeature(
    withHooks({
      onInit(store) {
        watchState(store, (state) => console.log('[TaskFormStore] state change', state));
      }
    })
  );
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

const TaskFormStoreBase = signalStore(
  { providedIn: 'root' },
  withState(initialTaskFormState),
  withProps(() => ({
    _originalTaskData: linkedSignal(() => null as TaskFormData | null)
  })),
  withComputed(({ selectedTask }) => ({
    formData: linkedSignal(() => ({
      title: selectedTask()?.title ?? '',
      completed: selectedTask()?.completed ?? false
    }))
  })),
  withLogging(),
  withMethods((store, rootStore = inject(Store)) => ({
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
    updateField(field: string, value: any): void {
      store.formData.update((current) => ({ ...current, [field]: value }));
      const current = store.formData();
      const original = store._originalTaskData();

      const isDirty = original
        ? current.title !== original.title || current.completed !== original.completed
        : current.title.trim().length > 0 || current.completed;

      patchState(store, { isDirty });
    },
    saveForm(): void {
      const data = store.formData();
      const title = data.title.trim();
      if (!title) {
        return;
      }

      if (store.isEditing() && store.selectedTask()) {
        rootStore.dispatch(
          updateTask({
            id: store.selectedTask()!.id,
            title,
            completed: data.completed
          })
        );
      } else {
        rootStore.dispatch(addTask({ title }));
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
    onInit: () => console.log('Store initialized')
  })
);

@Injectable({ providedIn: 'root' })
export class TaskFormStore extends TaskFormStoreBase {
  #originalTaskData: Task | null = null;
}
