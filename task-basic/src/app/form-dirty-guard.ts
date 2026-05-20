import { CanDeactivateFn } from '@angular/router';

export interface HasDirtyForm {
  canDeactivate: () => boolean;
}

export const formDirtyGuard: CanDeactivateFn<HasDirtyForm> = (component) => {
  return component.canDeactivate();
};
