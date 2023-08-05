import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FunctionsService } from '../utilities/services/functions.service';
import { FormControl } from '@angular/forms';
import { OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { OwlDatePickerModel } from '../utilities/models/owl-date-picker-model';
import { AppInitService } from '@app/app-initializer.service';
import { LocaleService } from '@app/shared/services/locale.service';

export const MY_MOMENT_FORMATS = {
	// parseInput: 'l LT',
	// fullPickerInput: (environment.meridiemFormat) ? 'l LT' : 'YYYY-MM-DD HH:mm:ss', // l LT
	// datePickerInput: 'l',
	// timePickerInput: 'LT',
	// monthYearLabel: 'MMM YYYY',
	// dateA11yLabel: 'LL',
	// monthYearA11yLabel: 'MMMM YYYY',
	fullPickerInput: {
		year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric',
		hour12: true
	},
	// datePickerInput: { year: 'numeric', month: 'numeric', day: 'numeric' },
	timePickerInput: { hour: 'numeric', minute: 'numeric', hour12: true },
	// monthYearLabel: { year: 'numeric', month: 'short' },
	// dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
	// monthYearA11yLabel: { year: 'numeric', month: 'long' },
};

@Component({
	selector: 'app-owl-date-picker',
	templateUrl: './owl-date-picker.component.html',
	styleUrls: ['./owl-date-picker.component.scss'],
	providers: [
		{ provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS },
	]
})
export class OwlDatePickerComponent implements OnInit {

	/**
	 * @desc Angular Input Decorator - Common Parameters
	 * @param object field - date field data.
	 * @param formControl control - date field control.
	 */
	@Input() field!: OwlDatePickerModel;
	@Input() control!: FormControl;

	/**
	 * @desc Angular Output Decorator - Common Parameters
	 * @param object helpLineEmit - help line json data.
	 */
	@Output() helpLineEmit = new EventEmitter();
	pickerOpen: boolean = false;
	format;
	constructor(
		public controlFunctions: FunctionsService,
		public locale: LocaleService,
		private preLoadService: AppInitService,
		@Inject(OWL_DATE_TIME_FORMATS) format: any
	) {
		this.format = format;
	}

	ngOnInit() {
		this.format.fullPickerInput.hour12 = this.preLoadService.configuration.meridiemFormat;
		this.format.timePickerInput.hour12 = this.preLoadService.configuration.meridiemFormat;
	}

	/**
	 * @desc To set necessary validation for date field
	 * @param dateEvent datePicker - datePicker event.
	 * @param formFieldJson renderField - Input field json data.
	 * @param FieldControl control - date field control.
	 */
	datePick(datePicker: any, renderField: any, control: any, event = null) {
		this.controlFunctions.datePicker = false;
		this.controlFunctions.datePickerIndex = this.controlFunctions.datePickerIndex + 1;
		const body: HTMLBodyElement | null = document.querySelector('body');
		if (body) {
			body.setAttribute('data-date-picker', 'inactive');
			if ([null].includes(datePicker) && [null, undefined, ''].includes(control.value)) {
				if (renderField.isRequired === true) {
					control.setErrors({ required: true });
				}
				control.markAsTouched();
			} else if (!([null].includes(datePicker))) {
				if (control.errors && control.errors.hasOwnProperty('required')) {
					control.setErrors(null);
				}
				this.controlFunctions.datePicker = true;
				body.setAttribute('data-date-picker', 'active');
				if (!datePicker.opened && !this.pickerOpen) {
					this.pickerOpen = true;
					datePicker.open();
				}
			}
			if (!([null, undefined, ''].includes(control.value)) &&
				renderField.additionalMetaData.hasOwnProperty('selectMode') && renderField.additionalMetaData.selectMode === 'range') {
				if (Array.isArray(control.value)) {
					let error = false;
					for (const data of control.value) {
						if ([null, undefined, ''].includes(data)) {
							error = true;
						}
					}
					if (error) {
						control.setErrors({ rangeDateTime: { msg: this.locale.translate('valid_date_range') } });
					}
				} else {

				}

			}
			if (event === 'close') {
				this.pickerOpen = false;
			}
		}
	}

	/**
	 * @desc Help line field change method
	 * @param object helpLineEmit - help line json data.
	 */
	helpLineData(data: any) {
		this.helpLineEmit.emit(data);
	}

	checkValue(value: any[]) {
		if (this.field && this.field.additionalMetaData && this.field.additionalMetaData.selectMode && this.field.additionalMetaData.selectMode === 'range') {
			if (Array.isArray(value)) {
				if (value.length === 0) {
					return false;
				} else {
					return true;
				}
			} else {
				return false;
			}
		}
		return true;
	}
}
