import { computed, inject } from '@angular/core';
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
import { firstValueFrom } from 'rxjs';
import { MockApiService } from './mock-api.service';
import { connectSignalDevtools } from './signal-devtools';
import { Task } from './task.model';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialTaskState: TaskState = {
  tasks: [],
  loading: false,
  error: null
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

export const TaskStore = signalStore(
  { providedIn: 'root' },
  withState(initialTaskState),
  withProps(() => ({
    _devtools: connectSignalDevtools('TaskStore')
  })),
  withComputed(({ tasks }) => ({
    stats: computed(() => {
      const taskList = tasks();
      const completed = taskList.filter((task) => task.completed).length;
      const total = taskList.length;

      return {
        total,
        completed,
        pending: total - completed
      };
    })
  })),
  withMethods((store, api = inject(MockApiService)) => ({
    async loadTasks(): Promise<void> {
      patchState(store, { loading: true, error: null });
      try {
        const tasks = await firstValueFrom(api.getTasks());
        patchState(store, { tasks, loading: false });
      } catch (error) {
        patchState(store, { loading: false, error: getErrorMessage(error) });
      }
    },
    async addTask(title: string): Promise<void> {
      patchState(store, { loading: true, error: null });
      try {
        const task = await firstValueFrom(api.addTask(title));
        patchState(store, (state) => ({
          tasks: [...state.tasks, task],
          loading: false
        }));
      } catch (error) {
        patchState(store, { loading: false, error: getErrorMessage(error) });
      }
    },
    async toggleTask(id: number): Promise<void> {
      patchState(store, { loading: true, error: null });
      try {
        const task = await firstValueFrom(api.toggleTask(id));
        patchState(store, (state) => ({
          tasks: state.tasks.map((item) => (item.id === id ? task : item)),
          loading: false
        }));
      } catch (error) {
        patchState(store, { loading: false, error: getErrorMessage(error) });
      }
    },
    async updateTask(id: number, title: string, completed: boolean): Promise<void> {
      patchState(store, { loading: true, error: null });
      try {
        const task = await firstValueFrom(api.updateTask(id, title, completed));
        patchState(store, (state) => ({
          tasks: state.tasks.map((item) => (item.id === id ? task : item)),
          loading: false
        }));
      } catch (error) {
        patchState(store, { loading: false, error: getErrorMessage(error) });
      }
    },
    async deleteTask(id: number): Promise<void> {
      patchState(store, { loading: true, error: null });
      try {
        await firstValueFrom(api.deleteTask(id));
        patchState(store, (state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
          loading: false
        }));
      } catch (error) {
        patchState(store, { loading: false, error: getErrorMessage(error) });
      }
    },
    taskById(id: number): Task | null {
      return store.tasks().find((task) => task.id === id) ?? null;
    }
  })),
  withHooks({
    onInit(store) {
      store._devtools?.init({
        tasks: store.tasks(),
        loading: store.loading(),
        error: store.error()
      });
      watchState(store, (state) => {
        store._devtools?.send('TaskStore state update', state);
      });
    }
  })
);
