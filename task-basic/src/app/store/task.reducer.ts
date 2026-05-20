import { createReducer, on } from '@ngrx/store';
import * as TaskActions from './task.actions';
import { Task } from './task.model';

export interface TaskState {
  tasks: Task[];
  nextId: number;
  loading: boolean;
  error: string | null;
}

export const initialTaskState: TaskState = {
  tasks: [],
  nextId: 1,
  loading: false,
  error: null
};

export const taskFeatureKey = 'task';

export const taskReducer = createReducer(
  initialTaskState,
  on(
    TaskActions.loadTasks,
    TaskActions.addTask,
    TaskActions.toggleTask,
    TaskActions.updateTask,
    TaskActions.deleteTask,
    (state) => ({
      ...state,
      loading: true,
      error: null
    })
  ),
  on(TaskActions.loadTasksSuccess, (state, { tasks }) => {
    const maxId = tasks.reduce((max, task) => Math.max(max, task.id), 0);
    return {
      ...state,
      tasks,
      nextId: maxId + 1,
      loading: false
    };
  }),
  on(TaskActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(TaskActions.addTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task],
    nextId: Math.max(state.nextId, task.id + 1),
    loading: false
  })),
  on(TaskActions.addTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(TaskActions.toggleTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map((existingTask) =>
      existingTask.id === task.id ? task : existingTask
    ),
    loading: false
  })),
  on(TaskActions.toggleTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(TaskActions.updateTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map((existingTask) =>
      existingTask.id === task.id ? task : existingTask
    ),
    loading: false
  })),
  on(TaskActions.updateTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(TaskActions.deleteTaskSuccess, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter((task) => task.id !== id),
    loading: false
  })),
  on(TaskActions.deleteTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
