import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Task } from './task.model';

@Injectable({ providedIn: 'root' })
export class MockApiService {
  private tasks: Task[] = [
    { id: 1, title: 'Learn NgRx basics', completed: false },
    { id: 2, title: 'Build first reducer', completed: true }
  ];
  private nextId = 3;

  getTasks(): Observable<Task[]> {
    return of(this.tasks.map((task) => ({ ...task }))).pipe(delay(500));
  }

  addTask(title: string): Observable<Task> {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return throwError(() => new Error('Task title is required'));
    }

    const task: Task = { id: this.nextId++, title: trimmedTitle, completed: false };
    this.tasks = [...this.tasks, task];
    return of({ ...task }).pipe(delay(500));
  }

  toggleTask(id: number): Observable<Task> {
    const existingTask = this.tasks.find((task) => task.id === id);
    if (!existingTask) {
      return throwError(() => new Error('Task not found'));
    }

    const updatedTask: Task = { ...existingTask, completed: !existingTask.completed };
    this.tasks = this.tasks.map((task) => (task.id === id ? updatedTask : task));
    return of({ ...updatedTask }).pipe(delay(500));
  }

  deleteTask(id: number): Observable<void> {
    const exists = this.tasks.some((task) => task.id === id);
    if (!exists) {
      return throwError(() => new Error('Task not found'));
    }

    this.tasks = this.tasks.filter((task) => task.id !== id);
    return of(void 0).pipe(delay(500));
  }
}
