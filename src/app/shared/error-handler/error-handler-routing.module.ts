import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorHandlerComponent } from './error-handler.component';

const routes: Routes = [
  { path: 'error', component: ErrorHandlerComponent },
  { path: 'no-network', component: ErrorHandlerComponent, data: { error: 'NETWORKERR' } },
  { path: 'cookie-blocked', component: ErrorHandlerComponent, data: { error: 'COOKIE' } },
  { path: '**', component: ErrorHandlerComponent, data: { error: 404 } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorHandlerRoutingModule { }
