import { Routes } from '@angular/router';
import { DynamicLayoutComponent } from './engine/dynamic-layout/dynamic-layout.component';
import { PageRendererComponent } from './engine/page-renderer/page-renderer.component';

export const routes: Routes = [
  {
    path: '',
    component: DynamicLayoutComponent,
    children: [
      {
        path: '**',
        component: PageRendererComponent
      }
    ]
  },
];
