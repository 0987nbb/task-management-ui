import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, mergeMap, of, switchMap } from 'rxjs';
import * as TaskActions from './task.actions';
import { MockApiService } from './mock-api.service';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unexpected error';
}

export const loadTasks$ = createEffect(
  (actions$ = inject(Actions), api = inject(MockApiService)) =>
    actions$.pipe(
      ofType(TaskActions.loadTasks),
      switchMap(() =>
        api.getTasks().pipe(
          map((tasks) => TaskActions.loadTasksSuccess({ tasks })),
          catchError((error: unknown) =>
            of(TaskActions.loadTasksFailure({ error: getErrorMessage(error) }))
          )
        )
      )
    ),
  { functional: true }
);

export const addTask$ = createEffect(
  (actions$ = inject(Actions), api = inject(MockApiService)) =>
    actions$.pipe(
      ofType(TaskActions.addTask),
      concatMap(({ title }) =>
        api.addTask(title).pipe(
          map((task) => TaskActions.addTaskSuccess({ task })),
          catchError((error: unknown) =>
            of(TaskActions.addTaskFailure({ error: getErrorMessage(error) }))
          )
        )
      )
    ),
  { functional: true }
);

export const toggleTask$ = createEffect(
  (actions$ = inject(Actions), api = inject(MockApiService)) =>
    actions$.pipe(
      ofType(TaskActions.toggleTask),
      mergeMap(({ id }) =>
        api.toggleTask(id).pipe(
          map((task) => TaskActions.toggleTaskSuccess({ task })),
          catchError((error: unknown) =>
            of(TaskActions.toggleTaskFailure({ error: getErrorMessage(error) }))
          )
        )
      )
    ),
  { functional: true }
);

export const updateTask$ = createEffect(
  (actions$ = inject(Actions), api = inject(MockApiService)) =>
    actions$.pipe(
      ofType(TaskActions.updateTask),
      mergeMap(({ id, title, completed }) =>
        api.updateTask(id, title, completed).pipe(
          map((task) => TaskActions.updateTaskSuccess({ task })),
          catchError((error: unknown) =>
            of(TaskActions.updateTaskFailure({ error: getErrorMessage(error) }))
          )
        )
      )
    ),
  { functional: true }
);

export const deleteTask$ = createEffect(
  (actions$ = inject(Actions), api = inject(MockApiService)) =>
    actions$.pipe(
      ofType(TaskActions.deleteTask),
      mergeMap(({ id }) =>
        api.deleteTask(id).pipe(
          map(() => TaskActions.deleteTaskSuccess({ id })),
          catchError((error: unknown) =>
            of(TaskActions.deleteTaskFailure({ error: getErrorMessage(error) }))
          )
        )
      )
    ),
  { functional: true }
);
