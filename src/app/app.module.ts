import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ErrorHandlerModule } from './shared/error-handler/error-handler.module';
import { RouterModule } from '@angular/router';
import { DirectivesModule } from './shared/directives/directives.module';
import { GlobalFunctionService, PipeModule } from './shared';
// import { SocialModule } from './modules/social/social.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DetectDeviceService } from './shared/services/detect-device.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppInitService } from './app-initializer.service';
// import { LeftLayoutComponent } from './modules/left-layout/left-layout.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CacheService } from './shared/services/cache.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ComponentsModule } from './components/components.module';
import { MatAnimatedIconModule } from './components/mat-animated-icon/mat-animated-icon.module';
import { MatDialogModule } from '@angular/material/dialog';
import { UIModule } from './components/ui/ui.module';
// import { HeaderComponent } from './components/header/header.component';
import { LoaderModule } from './components/loader/loader.module';
import { TemporaryComponent } from './temporary/temporary.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MenuListComponent } from './sidebar/menu-list/menu-list.component';
import { MatListModule } from '@angular/material/list';

@NgModule({
	declarations: [
		AppComponent,
		TemporaryComponent,
		SidebarComponent,
		MenuListComponent,

	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		FlexLayoutModule,
		MatButtonModule,
		MatIconModule,
		PipeModule,
		MatSnackBarModule,
		RouterModule,
		ErrorHandlerModule,
		MatRippleModule,
		MatChipsModule,
		MatAutocompleteModule,
		MatTooltipModule,
		RouterModule,
		DirectivesModule,
		MatSidenavModule,
		MatListModule,
		MatSelectModule,
		ComponentsModule,
		UIModule,
		MatAnimatedIconModule,
		MatCheckboxModule,
		MatDialogModule,
		ScrollingModule,
		MatProgressSpinnerModule,
		LoaderModule,
		// SocialModule,
		ServiceWorkerModule.register('service-worker.js', {
			enabled: environment.production,
			// Register the ServiceWorker as soon as the app is stable
			// or after 30 seconds (whichever comes first).
			registrationStrategy: 'registerWhenStable:30000'
		})
	],
	providers: [
		AppInitService,
		{
			provide: LocationStrategy,
			useClass: HashLocationStrategy
		},
		{
			provide: APP_INITIALIZER,
			useFactory: (appInit: AppInitService) => () => appInit.preLoad(),
			deps: [AppInitService],
			multi: true
		},
		GlobalFunctionService,
		DetectDeviceService,
		CacheService
	],
	bootstrap: [AppComponent],
	entryComponents: [],
	exports: []
})
export class AppModule { }
