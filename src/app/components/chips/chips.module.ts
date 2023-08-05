import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipsComponent } from './chips.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PipeModule } from '@app/shared/pipes/pipe.module';

@NgModule({
	declarations: [ChipsComponent],
	exports: [ChipsComponent],
	imports: [
		CommonModule,
		MatChipsModule,
		MatIconModule,
		MatTooltipModule,
		FlexLayoutModule,
		PipeModule
	]
})
export class ChipsModule { }
