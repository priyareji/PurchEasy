import { Component, OnInit, Directive, ViewChild, AfterViewInit, ChangeDetectorRef, Input, EventEmitter, Output, ContentChild, OnDestroy } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { DetectDeviceService } from '@app/shared/services/detect-device.service';
import { OptionMenu } from '@app/components/ui/models/ui-model';
import { GlobalFunctionService } from '@app/shared';

@Component({
	selector: 'app-content-view',
	templateUrl: './content-view.component.html',
	styleUrls: ['./content-view.component.scss']
})
export class ContentViewComponent implements OnInit, AfterViewInit, OnDestroy {

	@Input() insightsLoader = false;
	@Input() contentLoader = false;
	@Input() optionMenu: Array<OptionMenu> = [];
	@Input() breadCrumbs: Array<{
	}> = [];
	@ViewChild('insights') insights;
	@Output() optionInfo = new EventEmitter<OptionMenu>();
	@ContentChild('tab') tabData: MatTabGroup;

	showInsights = true;
	subscribesArr = [];
	timeOut;

	constructor(
		private cdref: ChangeDetectorRef,
		private gfService: GlobalFunctionService,
		private detectDevice: DetectDeviceService
	) { }

	ngOnInit(): void {
		this.subscribesArr.push(this.detectDevice.resolutionState$.subscribe((device) => {
			if (device.isChanged) {
				if (this.timeOut) {
					clearTimeout(this.timeOut);
				}
				if (this.tabData) {
					this.timeOut = setTimeout(() => {
						this.tabData.realignInkBar();
						this.cdref.detectChanges();
					}, 300);
				}
			}
		}));
	}

	ngAfterViewInit() {
		if (this.insights.nativeElement && this.insights.nativeElement.children.length > 1) {
			this.showInsights = true;
			this.cdref.detectChanges();
		} else {
			this.showInsights = false;
			this.cdref.detectChanges();
		}
	}

	optionAction(action) {
		if (navigator.onLine) {
			this.optionInfo.emit(action);
		}
	}

	ngOnDestroy() {
		if (this.subscribesArr && this.subscribesArr.length) {
			for (const subscribe of this.subscribesArr) {
				subscribe.unsubscribe();
			}
		}
	}
}

@Directive({
	selector: 'content-title'
})
export class ContentTitle { }

@Directive({
	selector: 'content-area'
})
export class ContentArea { }

@Directive({
	selector: 'insights'
})
export class ContentInsights { }
