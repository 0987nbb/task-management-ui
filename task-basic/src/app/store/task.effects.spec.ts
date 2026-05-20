import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { ReplaySubject, firstValueFrom, of, throwError } from 'rxjs';
import { take } from 'rxjs/operators';
import { vi } from 'vitest';
import { MockApiService } from './mock-api.service';
import * as TaskActions from './task.actions';
import * as TaskEffects from './task.effects';
import { Task } from './task.model';

describe('TaskEffects', () => {
  let actions$: ReplaySubject<Action>;
  let api: {
    getTasks: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    actions$ = new ReplaySubject<Action>(1);
    api = {
      getTasks: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        {
          provide: MockApiService,
          useValue: api
        }
      ]
    });
  });

  it('loadTasks$ should emit loadTasksSuccess when API returns tasks', async () => {
    const tasks: Task[] = [{ id: 1, title: 'Task A', completed: false }];
    api.getTasks.mockReturnValue(of(tasks));

    const resultPromise = firstValueFrom(TestBed.runInInjectionContext(TaskEffects.loadTasks$).pipe(take(1)));

    actions$.next(TaskActions.loadTasks());

    await expect(resultPromise).resolves.toEqual(
      TaskActions.loadTasksSuccess({ tasks })
    );
  });

  it('loadTasks$ should emit loadTasksFailure when API throws', async () => {
    api.getTasks.mockReturnValue(throwError(() => new Error('Load failed')));

    const resultPromise = firstValueFrom(TestBed.runInInjectionContext(TaskEffects.loadTasks$).pipe(take(1)));

    actions$.next(TaskActions.loadTasks());

    await expect(resultPromise).resolves.toEqual(
      TaskActions.loadTasksFailure({ error: 'Load failed' })
    );
  });
});
