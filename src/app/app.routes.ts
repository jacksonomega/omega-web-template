import { Routes } from '@angular/router';
import { PageRendererComponent } from './engine/page-renderer/page-renderer.component';

export const routes: Routes = [
  {
    path: '**',
    component: PageRendererComponent,
  },
];
