import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ErrorHandlerRoutingModule } from './error-handler-routing.module';
import { ErrorHandlerComponent } from './error-handler.component';
import { Interceptor } from './utilities/interceptor';
import { HandlerService } from './utilities/handler';
import { ErrorService } from './utilities/error.service';
import { NotificationComponent } from './notification/notification.component';
import { NotificationService } from './notification/notification.service';

@NgModule({
	imports: [
		CommonModule,
		ErrorHandlerRoutingModule
	],
	declarations: [
		ErrorHandlerComponent,
		NotificationComponent
	],
	providers: [
		HandlerService,
		ErrorService,
		NotificationService,
		{
			provide: ErrorHandler,
			useClass: HandlerService,
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: Interceptor,
			multi: true
		}
	],
	exports: [
		NotificationComponent
	]
})
export class ErrorHandlerModule { }
