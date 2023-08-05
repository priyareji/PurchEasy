import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from './badge.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
	declarations: [ BadgeComponent ],
	exports: [ BadgeComponent ],
	imports: [ CommonModule, FlexLayoutModule, MatIconModule ]
})
export class BadgeModule {}
