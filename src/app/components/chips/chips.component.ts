import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseService } from '@app/shared/services/base.service';
import { GlobalFunctionService } from '@app/shared/services/global-function.service';

@Component({
	selector: 'app-chips',
	templateUrl: './chips.component.html',
	styleUrls: ['./chips.component.scss']
})
export class ChipsComponent implements OnInit {

	@Input() type: 'standard' | 'classic' | 'prime' | 'legend' | 'count' | 'progressive' | 'grand' | 'capsule' | 'royal-capsule' = 'standard';
	@Input() data: any;
	@Input() classes: any;

	@Input() removable: boolean = false;
	@Input() changeFilter: boolean = true;
	@Input() background: string = 'var(--secondary-four)';
	@Input() color: string = 'var(--primary-one)';

	@Output() title = new EventEmitter<boolean>();
	@Output() users = new EventEmitter<boolean>();
	@Output() removed = new EventEmitter();
	@Output() chipInfo = new EventEmitter<boolean>();
	@Output() shortInfo = new EventEmitter<boolean>();
	@Output() action = new EventEmitter();

	disableRipple = true;
	skillLevelData: any;
	toolTip = '';

	constructor(
		public gfService: GlobalFunctionService
	) { }

	ngOnInit(): void {
		if (this.type === 'legend') {
			this.background = 'white';
		} else if (this.type === 'progressive' && this.data && this.data.toolTip) {
			const currentUser = this.gfService.sessionUser;
			if (currentUser.weightageData) {
				this.skillLevelData = currentUser.weightageData.map((data: any) => {
					return {
						key: data.termID,
						value: data.term,
						weightage: data.index,
						description: data.attributes.description
					};
				});
				let value = this.data.progress;
				if (value) {
					value = value.split('%');
					let finalValue;
					if (value && value.length) {
						let sliderValue = Number(value[0]);
						sliderValue = this.processData('general', sliderValue);
						if (!sliderValue) {
							sliderValue = 0;
						}
						finalValue = sliderValue;
						if (this.skillLevelData[finalValue]) {
							this.toolTip = this.skillLevelData[finalValue].value;
						}
					}
				}
			}
		}
	}


	processData(type: 'general' | 'expected' = 'general', sliderValue: number) {
		if (Array.isArray(this.skillLevelData) && this.skillLevelData.length) {
			const weightageData: any = this.skillLevelData.filter(items => items.key !== null);
			const individualPercentage = 100 / weightageData.length;
			weightageData.map((resp: any, index: number) => {
				resp.percentage = individualPercentage * (index + 1);
			});
			var closest = this.closestValue(weightageData, sliderValue);
			if (closest) {
				weightageData.map((data: any, index: number) => {
					if (data.percentage === closest) {
						sliderValue = index;
					}
				});
				if (!([null, undefined].includes(this.skillLevelData[sliderValue].weightage))) {
					sliderValue = this.skillLevelData[sliderValue].weightage;
				}
			} else {
				sliderValue = 0;
			}
		}
		let returnData = sliderValue - 1;
		if (returnData < 0) {
			returnData = 0;
		}
		return returnData;
	}

	closestValue(data: any[], value: number) {
		return data.reduce(function (prev: any, curr: any) {
			let prevValue = prev;
			let currentValue = curr;
			if (prevValue.hasOwnProperty('percentage')) {
				prevValue = prevValue.percentage;
			}
			if (currentValue.hasOwnProperty('percentage')) {
				currentValue = currentValue.percentage;
			}
			return (Math.abs(currentValue - value) < Math.abs(prevValue - value) ? currentValue : prevValue);
		});
	}

	titleInfo(): boolean | void {
		if (this.type === 'royal-capsule' && !this.changeFilter) {
			return false;
		}
		this.title.emit(true);
	}

	usersInfo() {
		this.users.emit(true);
	}

	remove(el: any) {
		this.removed.emit(el);
	}

	chip() {
		this.chipInfo.emit(true);
	}

	shortInformation() {
		this.shortInfo.emit(true);
	}

	iconAction(data: any, actionEl: any) {
		this.action.emit({ data, actionEl });
	}
}
