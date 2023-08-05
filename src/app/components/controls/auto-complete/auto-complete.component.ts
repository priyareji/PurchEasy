import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges, ChangeDetectorRef, DoCheck, AfterViewChecked, AfterViewInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FunctionsService } from '../utilities/services/functions.service';
import { AutoCompleteModel } from '../utilities/models/auto-complete-model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { GlobalFunctionService } from '@app/shared/services/global-function.service';
import { MatDialog } from '@angular/material/dialog';
import { LocaleService } from '@app/shared/services/locale.service';

@Component({
	selector: 'app-auto-complete',
	templateUrl: './auto-complete.component.html',
	styleUrls: ['./auto-complete.component.scss']
})
export class AutoCompleteComponent implements OnInit, OnChanges, DoCheck, AfterViewChecked, AfterViewInit {

	addOnBlur = true;
	separatorKeysCodes: number[] = [ENTER, COMMA];
	@ViewChild('fieldInput', { static: false }) fieldInput!: ElementRef<HTMLInputElement>;
	@ViewChild('auto', { static: false }) matAutocomplete!: MatAutocomplete;
	/**
	 * @desc Angular Input Decorator - Common Parameters
	 * @param object field - auto complete field data.
	 * @param formConrtol control - auto complete field control.
	 */
	@Input() field!: AutoCompleteModel;
	@Input() control!: FormControl;

	/**
	 * @desc Angular Output Decorator - Common Parameters
	 * @param object helpLineEmit - help line json data.
	 */
	@Output() helpLineEmit = new EventEmitter();
	@Output() fieldIconEmit = new EventEmitter();

	disabled: boolean = false;
	loader: boolean = false;
	focus: boolean = false;
	fieldData: any;
	timeout: any;
	opened: boolean = false;
	closeTemplate: boolean = false;
	isPop: boolean = false;

	constructor(
		public controlFunctions: FunctionsService,
		public gfService: GlobalFunctionService,
		private cdref: ChangeDetectorRef,
		public locale: LocaleService,
		private popup: MatDialog
	) { }

	ngOnInit() {
		this.control.valueChanges.subscribe(resp => {
			if (navigator.onLine) {
				if (resp && typeof resp === 'string') {
					this.fieldData.options = [];
					this.loader = (this.field.additionalMetaData.loadOptions ? this.field.additionalMetaData.loadOptions : false);
				}
			}
		});
		this.fieldData = { ...this.field };
		if (this.field.additionalMetaData && this.field.additionalMetaData.separatorKeysCodes && this.field.additionalMetaData.separatorKeysCodes.length) {
			this.separatorKeysCodes = this.separatorKeysCodes.concat(this.field.additionalMetaData.separatorKeysCodes);
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.field && changes.field.currentValue) {
			const field = changes.field.currentValue;
			const control = changes.control.currentValue;
			if (field.selectedValue && field.selectedValue.length) {
				if (field.isMultiple && field.additionalMetaData.min && field.selectedValue.length < field.additionalMetaData.min) {
					// control.patchValue('null');
					// control.setErrors({ minlength: { requiredLength: field.additionalMetaData.min } });
					// this.control.setErrors({ 'incorrect': true });
					// this.cdref.detectChanges();
				}
			}
			// if (changes.field.currentValue.type === 'weightage') {
			// 	if (field.selectedValue && field.selectedValue.length) {
			// 		for (const value of field.selectedValue) {
			// 			if (value.hasOwnProperty('weightage') || value.hasOwnProperty('expectedWeightage')) {
			// 				let weightage: any = field.additionalMetaData.maxWeightage;
			// 				if (Array.isArray(field.additionalMetaData.maxWeightage)) {
			// 					if (field.additionalMetaData.maxWeightage.length) {
			// 						weightage = field.additionalMetaData.maxWeightage.length - 1;
			// 					}
			// 				}
			// 				if (value.hasOwnProperty('weightage')) {
			// 					let sliderValue = value.weightage;
			// 					if (Array.isArray(field.additionalMetaData.maxWeightage)) {
			// 						if (field.additionalMetaData.maxWeightage.length) {
			// 							sliderValue = this.processData('general', sliderValue);
			// 							if (!sliderValue) {
			// 								value.weightage = 0;
			// 							}
			// 							// if (!([null, undefined].includes(field.additionalMetaData.maxWeightage[value].weightage))) {
			// 							// 	sliderValue = field.additionalMetaData.maxWeightage[value].weightage;
			// 							// }
			// 						}
			// 					}
			// 					value.progress = Number(((sliderValue / weightage) * 100).toFixed(2));
			// 					value.weightage = sliderValue;
			// 				}
			// 				if (value.hasOwnProperty('expectedWeightage')) {
			// 					let sliderValue = value.expectedWeightage;
			// 					if (Array.isArray(field.additionalMetaData.maxWeightage)) {
			// 						if (field.additionalMetaData.maxWeightage.length) {
			// 							sliderValue = this.processData('expected', sliderValue);
			// 							// if (!([null, undefined].includes(field.additionalMetaData.maxWeightage[value].weightage))) {
			// 							// 	sliderValue = field.additionalMetaData.maxWeightage[value].weightage;
			// 							// }
			// 						}
			// 					}
			// 					value.expected = ((sliderValue / weightage) * 100).toFixed(2);
			// 				}
			// 			}
			// 		}
			// 	}
			// }
		}
	}

	ngAfterViewChecked() {
		this.field.options = [];
	}

	ngAfterViewInit() {
		if (this.field.isMultiple && this.field.selectedValue.length && typeof this.field.additionalMetaData.min === 'number') {
			if (this.field.additionalMetaData.min > this.field.selectedValue.length) {
				this.control.setErrors({ minlength: { requiredLength: this.field.additionalMetaData.min } });
			}
		}
		this.checkMaxMin();
	}

	/**
	 * @desc Display the auto complete value
	 * @param object data - auto complete data.
	 */
	displayAC(data: any) {
		if (data && typeof data === 'object') {
			return data.value;
		}
	}

	remove(index: number) {
		this.field.selectedValue[index].isDelete = true;
		const deletedItems = [];
		const selectedValue = [];
		for (const data of this.field.selectedValue) {
			if (data.isDelete) {
				deletedItems.push(data);
			} else if (data.isAdd) {
				selectedValue.push(data);
			}
		}
		this.control.patchValue(null);
		if (selectedValue.length && this.control.errors && this.control.errors.required) {
			this.control.setErrors(null);
		}
		if (deletedItems.length === this.field.selectedValue.length) {
			if (this.field.isRequired) {
				this.control.setErrors({ required: true });
			}
		} else if (selectedValue.length && this.field.isMultiple && this.field.additionalMetaData.min && selectedValue.length < this.field.additionalMetaData.min) {
			this.control.setErrors({ minlength: { requiredLength: this.field.additionalMetaData.min } });
		}
		if (this.disabled) {
			const el: HTMLElement = this.fieldInput.nativeElement;
			el.setAttribute('placeholder', (this.field.fieldPlaceholder || ''));
			this.disabled = false;
		}
	}

	add(event: MatChipInputEvent): void {
		// Add value only when MatAutocomplete is not open
		// To make sure this does not conflict with OptionSelected Event
		this.isPop = false;
		if (!this.loader || !this.field.additionalMetaData.loadOptions) {
			if (this.field.isMultiple && (this.control.status === 'VALID' ||
				(this.control.errors && this.control.errors.autoComplete && this.control.errors.autoComplete.data))) {
				const input = event.input;
				const value: any = event.value;
				if (!this.field.preDefined) {
					for (const data of this.field.selectedValue) {
						// if (!data.hasOwnProperty('key')) {
						if ((data.value.toLocaleLowerCase() === value.toLocaleLowerCase().trim()) && !data.isDelete) {
							if (input) {
								input.value = '';
								this.control.setErrors(null);
							}
							return;
						}
						// }
					}
					// Add our value
					if ((value || '').trim()) {
						let pushData: any = {
							value: value.trim(),
							isAdd: true
						};
						let data;
						if (this.fieldData.options.length === 1) {
							if (this.fieldData.options[0].value.toLocaleLowerCase() === event.value.toLocaleLowerCase()) {
								data = this.fieldData.options[0];
								data.isAdd = true;
							}
						}
						if (data) {
							pushData = data;
						}
						// if (value && this.field.type === 'weightage') {
						// 	let sliderValue: any = this.field.additionalMetaData.defaultWeightage;
						// 	if (sliderValue) {
						// 		pushData.weightage = sliderValue;
						// 		if (Array.isArray(this.field.additionalMetaData.maxWeightage) && this.field.additionalMetaData.maxWeightage.length) {
						// 			if (!([null, undefined].includes(this.field.additionalMetaData.maxWeightage[sliderValue].weightage))) {
						// 				sliderValue = this.field.additionalMetaData.maxWeightage[sliderValue].weightage;
						// 				// weightage = this.field.additionalMetaData.maxWeightage.length;
						// 			}
						// 		}
						// 		let weightage: any = this.field.additionalMetaData.maxWeightage;
						// 		if (Array.isArray(this.field.additionalMetaData.maxWeightage)) {
						// 			weightage = this.field.additionalMetaData.maxWeightage.length - 1;
						// 		}
						// 		pushData.progress = Number(((sliderValue / weightage) * 100).toFixed(2));
						// 	}
						// }
						if (!data) {
							this.isPop = true;
						}
						this.field.selectedValue.push(pushData);
						// if (this.fieldData.options.length === 1) {
						// 	if (this.fieldData.options[0].value.toLocaleLowerCase() === event.value.toLocaleLowerCase()) {
						// 		const data = this.fieldData.options[0];
						// 		data.isAdd = true;
						// 		this.field.selectedValue.push(data);
						// 		// input.value = '';
						// 		// this.control.setErrors(null);
						// 	} else {
						// 		this.field.selectedValue.push(pushData);
						// 		this.isPop = true;
						// 	}
						// } else {
						// 	this.field.selectedValue.push(pushData);
						// 	this.isPop = true;
						// }
						this.control.patchValue(value.trim(), { emitEvent: false });
						this.checkMaxMin();
					}

					// Reset the input value
					if (input) {
						input.value = '';
					}
					setTimeout(() => {
						this.fieldData.options = [];
						// this.field.options = [];
					}, 300);
				} else {
					if (!this.matAutocomplete.isOpen) {
						input.value = '';
						this.control.setErrors(null);
						const deletedItems = [];
						for (const data of this.field.selectedValue) {
							if (data.isDelete) {
								deletedItems.push(data);
							}
						}
						if (this.field.isRequired && deletedItems.length === this.field.selectedValue.length) {
							this.control.setErrors({ required: true });
						}
					}
				}
			}
		}
	}

	selected(event: MatAutocompleteSelectedEvent): void {
		if (event.option.value.isDelete) {
			event.option.value.isDelete = false;
		}
		if (event.option.value && !event.option.value.isAdd) {
			if (this.field.isMultiple) {
				this.fieldInput.nativeElement.value = '';
			} else {
				this.field.selectedValue = [];
			}
			// if (this.field.type === 'weightage') {
			// 	let weightage: any = this.field.additionalMetaData.maxWeightage;
			// 	if (Array.isArray(this.field.additionalMetaData.maxWeightage)) {
			// 		weightage = this.field.additionalMetaData.maxWeightage.length - 1;
			// 	}
			// 	if (!event.option.value.hasOwnProperty('weightage')) {
			// 		let sliderValue: any = this.field.additionalMetaData.defaultWeightage;
			// 		event.option.value.weightage = sliderValue;
			// 		if (Array.isArray(this.field.additionalMetaData.maxWeightage) && this.field.additionalMetaData.maxWeightage.length) {
			// 			if (!([null, undefined].includes(this.field.additionalMetaData.maxWeightage[sliderValue].weightage))) {
			// 				sliderValue = this.field.additionalMetaData.maxWeightage[sliderValue].weightage;
			// 				// weightage = this.field.additionalMetaData.maxWeightage.length;
			// 			}
			// 		}
			// 		event.option.value.progress = Number(((sliderValue / weightage) * 100).toFixed(2));
			// 	}
			// 	if (event.option.value.hasOwnProperty('expectedWeightage')) {
			// 		let sliderValue = event.option.value.expectedWeightage;
			// 		if (Array.isArray(this.field.additionalMetaData.maxWeightage) && this.field.additionalMetaData.maxWeightage.length) {
			// 			if (!([null, undefined, 0].includes(this.field.additionalMetaData.maxWeightage[sliderValue].weightage))) {
			// 				sliderValue = this.processData('expected', sliderValue);
			// 				// sliderValue = this.field.additionalMetaData.maxWeightage[sliderValue].weightage;
			// 				//// weightage = this.field.additionalMetaData.maxWeightage.length;
			// 			}
			// 		}
			// 		event.option.value.expected = ((sliderValue / weightage) * 100).toFixed(2);
			// 	}
			// }
			if (this.isPop) {
				this.field.selectedValue.pop();
			}
			this.isPop = false;
			event.option.value.isDelete = false;
			this.field.selectedValue.push(event.option.value);
			this.field.selectedValue[this.field.selectedValue.length - 1].isAdd = true;
			this.control.patchValue(event.option.value);
			this.loader = false;
			this.checkMaxMin();
		}
	}

	checkMaxMin() {
		if (this.field.isMultiple) {
			if (this.field.additionalMetaData.max || this.field.additionalMetaData.min) {
				const selectedValue = this.field.selectedValue.filter(items => items.isAdd && !items.isDelete);
				if (this.field.additionalMetaData.max) {
					if (selectedValue.length === this.field.additionalMetaData.max) {
						const el: HTMLElement = this.fieldInput.nativeElement;
						el.removeAttribute('placeholder');
						this.disabled = true;
						this.cdref.detectChanges();
					}
				}
				if (typeof this.field.additionalMetaData.min === 'number') {
					if (selectedValue.length < this.field.additionalMetaData.min) {
						this.control.setErrors({ minlength: { requiredLength: this.field.additionalMetaData.min } });
					}
				}
			}
		}
	}

	// processData(type: 'general' | 'expected' = 'general', sliderValue: number) {
	// 	if (Array.isArray(this.field.additionalMetaData.maxWeightage) && this.field.additionalMetaData.maxWeightage.length) {
	// 		const weightageData: any = this.field.additionalMetaData.maxWeightage.filter(items => items.key !== null);
	// 		const individualPercentage = 100 / weightageData.length;
	// 		weightageData.map((resp, index) => {
	// 			resp.percentage = individualPercentage * (index + 1);
	// 		});
	// 		var closest = this.closestValue(weightageData, sliderValue);
	// 		if (closest) {
	// 			weightageData.map((data, index) => {
	// 				if (data.percentage === closest) {
	// 					sliderValue = index + 1;
	// 				}
	// 			});
	// 			if (type === 'general' && weightageData[sliderValue - 1]) {
	// 				this.field.value = weightageData[sliderValue - 1].weightage;
	// 			}
	// 			if (!([null, undefined].includes(this.field.additionalMetaData.maxWeightage[sliderValue].weightage))) {
	// 				sliderValue = this.field.additionalMetaData.maxWeightage[sliderValue].weightage;
	// 			}
	// 		} else {
	// 			sliderValue = 0;
	// 		}
	// 	}
	// 	return sliderValue;
	// }

	closestValue(data: any[], value: any) {
		return data.reduce(function (prev, curr) {
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

	// sliderChange(event: MatSliderChange, value: any) {
	// 	let weightage: any = this.field.additionalMetaData.maxWeightage;
	// 	value.weightage = event.value;
	// 	let sliderValue: any = event.value;
	// 	if (Array.isArray(this.field.additionalMetaData.maxWeightage) && this.field.additionalMetaData.maxWeightage.length) {
	// 		weightage = this.field.additionalMetaData.maxWeightage.length - 1;
	// 		if (!([null, undefined].includes(this.field.additionalMetaData.maxWeightage[event.value].weightage))) {
	// 			sliderValue = this.field.additionalMetaData.maxWeightage[event.value].weightage;
	// 			// weightage = this.field.additionalMetaData.maxWeightage.length;
	// 		}
	// 	}
	// 	value.progress = Number(((sliderValue / weightage) * 100).toFixed(2));
	// 	this.cdref.detectChanges();
	// }

	// sliderInputChange(event: MatSelectChange, value) {
	// 	if (this.field.additionalMetaData.hasOwnProperty('minWeightage') && this.field.additionalMetaData.minWeightage >= event.value) {
	// 		value.weightage = this.field.additionalMetaData.minWeightage;
	// 		event.source.value = this.field.additionalMetaData.minWeightage;
	// 	}
	// }

	focusSlider() {
		clearTimeout(this.timeout);
	}

	isOpen(status: boolean) {
		this.opened = status;
		// this.closeTemplate = status;
		if (status) {
			this.timeoutManage();
		} else {
			clearTimeout(this.timeout);
		}
	}

	leaveSlider() {
		if (this.opened) {
			clearTimeout(this.timeout);
			this.timeoutManage();
		}
	}

	timeoutManage() {
		this.closeTemplate = false;
		this.timeout = setTimeout(() => {
			this.closeTemplate = true;
		}, 3000);
	}

	fieldChange() {
		// console.log(this.fieldData, this.control.value);
		// if (this.fieldData.options && this.fieldData.options.length === 0) {
		this.validate();
		// }
		// if (!this.control.value) {
		// 	console.log(this.field.selectedValue);
		// 	if(this.fieldData.isMultiple){
		// 		const deletedItems = [];
		// 		for (const data of this.field.selectedValue) {
		// 			if (data.isDelete) {
		// 				deletedItems.push(data);
		// 			}
		// 		}
		// 		if (deletedItems.length !== this.field.selectedValue.length) {
		// 			this.control.setErrors(null);
		// 		} else {
		// 			if (this.field.isRequired) {
		// 				this.control.setErrors({ required: true });
		// 			}
		// 		}
		// 	} else {
		// 		if (this.field.selectedValue.length) {
		// 			this.field.selectedValue = [];
		// 			this.fieldData.selectedValue = [];
		// 			this.control.setErrors(null);
		// 		} else {
		// 			if (this.field.isRequired) {
		// 				this.control.setErrors({ required: true });
		// 			}
		// 		}
		// 	}
		// }
	}

	keyPress(event: any) {
		if (this.field.additionalMetaData.max && this.field.isMultiple) {
			const selectedValue = this.field.selectedValue.filter(items => items.isAdd && !items.isDelete);
			if (selectedValue.length === this.field.additionalMetaData.max) {
				this.fieldInput.nativeElement.value = '';
				this.disabled = true;
				const el: HTMLElement = this.fieldInput.nativeElement;
				event.preventDefault();
				this.cdref.detectChanges();
			}
		}
	}

	focusout() {
		// this.validate();
	}

	validate() {
		if (this.field.isMultiple) {
			if (this.control.value) {
				// if(this.field.preDefined && typeof this.control.value === 'string'){
				// 	this.control.setErrors({ autoComplete: { msg: this.locale.translate('enter_valid_data') } });
				// } else
				if (this.field.validationRegex) {
					const validationRegex = new RegExp(this.field.validationRegex);
					let controlValue = this.control.value;
					if (typeof this.control.value === 'object' && this.control.value && this.control.value.hasOwnProperty('value')) {
						controlValue = this.control.value.value;
					}
					if (controlValue) {
						if (validationRegex.test(controlValue)) {
							// this.control.setErrors(null);
						} else {
							this.control.setErrors({
								incorrect: {
									msg: this.field.validationMessage
								}
							});
						}
					}
				}
			} else {
				const deletedItems = [];
				for (const data of this.field.selectedValue) {
					if (data.isDelete) {
						deletedItems.push(data);
					}
				}
				if (deletedItems.length !== this.field.selectedValue.length) {
					this.control.setErrors(null);
				} else {
					if (this.field.isRequired) {
						this.control.setErrors({ required: true });
					} else {
						this.control.setErrors(null);
					}
				}
			}
		} else {
			if (this.control.value) {
				// if(this.field.preDefined && typeof this.control.value === 'string' && !this.field.selectedValue.find(items => items.value === this.control.value)){
				// 	this.control.setErrors({ autoComplete: { msg: this.locale.translate('enter_valid_data') } });
				// } else
				if (this.field.validationRegex) {
					const validationRegex = new RegExp(this.field.validationRegex);
					let controlValue = this.control.value;
					if (typeof this.control.value === 'object' && this.control.value && this.control.value.hasOwnProperty('value')) {
						controlValue = this.control.value.value;
					}
					if (controlValue) {
						if (validationRegex.test(controlValue)) {
							// this.control.setErrors(null);
						} else {
							this.control.setErrors({
								incorrect: {
									msg: this.field.validationMessage
								}
							});
						}
					}
				}
			} else {
				this.field.selectedValue = [];
				this.fieldData.selectedValue = [];
				if (this.field.isRequired) {
					this.control.setErrors({ required: true });
				} else {
					this.control.setErrors(null);
				}
			}
		}
		// if (this.field.preDefined) {
		// 	if (this.field.isMultiple) {
		// 		if (this.control.value && typeof this.control.value === 'string') {
		// 			this.control.setErrors({ autoComplete: { msg: this.locale.translate('enter_valid_data') } });
		// 		} else {
		// 			const deletedItems = [];
		// 			for (const data of this.field.selectedValue) {
		// 				if (data.isDelete) {
		// 					deletedItems.push(data);
		// 				}
		// 			}
		// 			if (deletedItems.length !== this.field.selectedValue.length) {
		// 				this.control.setErrors(null);
		// 			} else {
		// 				if (this.field.isRequired) {
		// 					this.control.setErrors({ required: true });
		// 				}
		// 			}
		// 		}
		// 	} else {
		// 		if (this.control.value) {
		// 			if (typeof this.control.value === 'string' && !this.field.selectedValue.find(items => items.value === this.control.value)) {
		// 				this.control.setErrors({
		// 					autoComplete: {
		// 						msg: this.locale.translate('enter_valid_data')
		// 					}
		// 				});
		// 			} else {
		// 				if (this.field.selectedValue.length) {
		// 					this.control.setErrors(null);
		// 				} else {
		// 					if (this.field.isRequired) {
		// 						this.control.setErrors({ required: true });
		// 					}
		// 				}
		// 			}
		// 		} else {
		// 			this.field.selectedValue = [];
		// 			this.fieldData.selectedValue = [];
		// 			if (this.field.isRequired) {
		// 				this.control.setErrors({ required: true });
		// 			}
		// 		}
		// 	}
		// } else {
		// 	if (this.fieldData.options.length === 0) {
		// 		if (!this.control.value && !this.field.isRequired) {
		// 			this.control.setErrors(null);
		// 		}
		// 		if (this.field.validationRegex) {
		// 			const validationRegex = new RegExp(this.field.validationRegex);
		// 			let controlValue = this.control.value;
		// 			if (typeof this.control.value === 'object' && this.control.value && this.control.value.hasOwnProperty('value')) {
		// 				controlValue = this.control.value.value;
		// 			}
		// 			if (controlValue) {
		// 				if (validationRegex.test(controlValue)) {
		// 					// this.control.setErrors(null);
		// 				} else {
		// 					this.control.setErrors({
		// 						incorrect: {
		// 							msg: this.field.validationMessage
		// 						}
		// 					});
		// 				}
		// 			}
		// 		}
		// 	}
		// }
	}

	showHelp() {
		if (navigator.onLine) {
			// if (this.field.additionalMetaData.showHelp) {
			// 	this.closeTemplate = true;
			// 	const dialogRef = this.popup.open(PopupComponent, {
			// 		panelClass: ['custom-panel'],
			// 		// height: 'auto',
			// 		// width: 'auto',
			// 		// maxWidth: 'auto',
			// 		data: {
			// 			action: 'skillLevelDesc',
			// 			popup: true,
			// 			helpData: this.field.additionalMetaData.maxWeightage
			// 		},
			// 		disableClose: true,
			// 		maxWidth: '860px',
			// 		autoFocus: false
			// 	});
			// 	dialogRef.afterClosed().subscribe(async (result) => {
			// 		if (result) {
			// 		}
			// 	});
			// }
		}
	}

	ngDoCheck() {
		if (this.field.selectedValue && !this.field.selectedValue.length && this.disabled) {
			this.disabled = false;
		}
		if (this.field.options && this.field.options.length === 0) {
			this.loader = false;
		}
		if (this.field.options && this.field.options.length > 0) {
			this.loader = false;
			// const selectedValue = this.field.selectedValue.filter(items => {
			// 	if (items.isAdd && !items.isDelete) {
			// 		return items;
			// 	}
			// });
			// if (selectedValue.length) {
			// 	if (this.field.isMultiple && this.field.additionalMetaData.min && selectedValue.length < this.field.additionalMetaData.min) {
			// 		this.control.setErrors({ minlength: { requiredLength: this.field.additionalMetaData.min } });
			// 	} else {
			// 		this.control.setErrors(null);
			// 	}
			// }
			// if (!([null, undefined, ''].includes(this.control.value))) {
			// 	if (typeof this.control.value !== 'object') {
			// 		this.control.setErrors({
			// 			autoComplete: {
			// 				msg: this.locale.translate('enter_valid_data'),
			// 				data: true
			// 			}
			// 		});
			// 	}
			// }
			this.fieldData.options = this.field.options;
		}
		if (!this.loader) {
			if (this.control.value && this.field.preDefined && typeof this.control.value === 'string') {
				this.control.setErrors({ autoComplete: { msg: this.locale.translate('enter_valid_data') } });
			}
		}
	}

	/**
	 * @desc Help line field change method
	 * @param object helpLineEmit - Clicked help line json data.
	 */
	helpLineData(data: any) {
		this.helpLineEmit.emit(data);
	}

	/**
 * @desc Field icon change method
 * @param object fieldIconEmit - field icon json data.
 */
	fieldIconData(icon: any) {
		this.fieldIconEmit.emit({ iconData: icon, value: this.control.value });
	}
}
