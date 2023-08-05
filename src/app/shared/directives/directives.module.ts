import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutSideDirective } from './click-out-side/click-out-side.directive';
import { DragDropDirective } from './drag/drag-drop.directive';
import { ThemeSwticherDirective } from './theme-switcher/theme-switcher.directive';
import { DynoProgressDirective } from './dyno-progress/dyno-progress.directive';
import { ViewportAnalyzerDirective } from './viewport-analyzer/viewport-analyzer.directive';
import { AutoFocusDirective } from './auto-focus/auto-focus.directive';

@NgModule({
	declarations: [
		ClickOutSideDirective,
		DragDropDirective,
		ThemeSwticherDirective,
		DynoProgressDirective,
		ViewportAnalyzerDirective,
		AutoFocusDirective
	],
	imports: [CommonModule],
	exports: [
		ClickOutSideDirective,
		DragDropDirective,
		ThemeSwticherDirective,
		DynoProgressDirective,
		ViewportAnalyzerDirective,
		AutoFocusDirective
	]
})
export class DirectivesModule { }
