import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { SliderComponent } from './slider/slider.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ControlsModule } from './controls/controls.module';
import { PipeModule } from '@app/shared/pipes/pipe.module';
import { MatChipsModule } from '@angular/material/chips';
import { PopupComponent } from './popup/popup.component';
import { SnackBarComponent } from './snack-bar/snack-bar.component';
import { ReadabilityComponent, ReadabilityContent } from './readability/readability.component';
import { CommonListComponent, ListItemsComponent } from './common-list/common-list.component';
import { FormGroupComponent } from './form-group/form-group.component';
import { FormComponent } from './form/form.component';
import { ChipsModule } from './chips/chips.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BadgeModule } from './badge/badge.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { DirectivesModule } from '@app/shared/directives/directives.module';
import { AlertModule } from '@app/components/alert/alert.module';
import { UIModule } from './ui/ui.module';
import { LoaderModule } from './loader/loader.module';
import { HeaderComponent } from './header/header.component';
import { DynamicFormGroupComponent } from './dynamic-form-group/dynamic-form-group.component';
import { CommonViewComponent } from './common-view/common-view.component';
import { CollapsibleBlockComponent } from './collapsible-block/collapsible-block.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
	declarations: [
		PopupComponent,
		SnackBarComponent,
		SliderComponent,
		ReadabilityComponent,
		CommonListComponent,
		HeaderComponent,
		ListItemsComponent,
		CommonViewComponent,
		CollapsibleBlockComponent,
		FormGroupComponent,
		FormComponent,
		ReadabilityContent,
		DynamicFormGroupComponent
	],
	imports: [
		CommonModule,
		MatIconModule,
		FlexLayoutModule,
		PipeModule,
		MatExpansionModule,
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatTooltipModule,
		MatChipsModule,
		ControlsModule,
		ChipsModule,
		MatPaginatorModule,
		BadgeModule,
		CarouselModule,
		MatProgressSpinnerModule,
		MatRippleModule,
		DirectivesModule,
		LoaderModule,
		AlertModule,
		UIModule,
		MatMenuModule
	],
	exports: [
		LoaderModule,
		SnackBarComponent,
		SliderComponent,
		ControlsModule,
		ReadabilityComponent,
		CommonListComponent,
		ListItemsComponent,
		FormGroupComponent,
		DynamicFormGroupComponent,
		FormComponent,
		CollapsibleBlockComponent,
		HeaderComponent,
		ChipsModule,
		ReadabilityContent,
		CommonViewComponent,
		BadgeModule,
		PopupComponent,
		AlertModule,
		UIModule
	],
	providers: [],
	entryComponents: [PopupComponent, SnackBarComponent]
})
export class ComponentsModule { }
