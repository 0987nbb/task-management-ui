import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TaskState, taskFeatureKey } from './task.reducer';

export const selectTaskState = createFeatureSelector<TaskState>(taskFeatureKey);

export const selectAllTasks = createSelector(
  selectTaskState,
  (state) => state.tasks
);

export const selectTaskById = (id: number) =>
  createSelector(selectAllTasks, (tasks) => tasks.find((task) => task.id === id) ?? null);

export const selectTaskLoading = createSelector(
  selectTaskState,
  (state) => state.loading
);

export const selectTaskError = createSelector(
  selectTaskState,
  (state) => state.error
);

export const selectPendingTasks = createSelector(selectAllTasks, (tasks) =>
  tasks.filter((task) => !task.completed)
);

export const selectCompletedTasks = createSelector(selectAllTasks, (tasks) =>
  tasks.filter((task) => task.completed)
);

export const selectTaskStats = createSelector(
  selectAllTasks,
  selectPendingTasks,
  selectCompletedTasks,
  (tasks, pending, completed) => ({
    total: tasks.length,
    pending: pending.length,
    completed: completed.length
  })
);
