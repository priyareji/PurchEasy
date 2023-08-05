import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAnimatedIconComponent } from './mat-animated-icon.component';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
	declarations: [MatAnimatedIconComponent],
	imports: [
		CommonModule,
		MatIconModule
	],
	exports: [
		MatAnimatedIconComponent
	]
})
export class MatAnimatedIconModule { }
