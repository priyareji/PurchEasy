import { Component, OnInit, EventEmitter, Output, Input, AfterViewInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BuilderService } from '@app/components/controls/utilities/services/builder.service';
import { AppInitService } from '@app/app-initializer.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-form-group',
	templateUrl: './form-group.component.html',
	styleUrls: ['./form-group.component.scss']
})
export class FormGroupComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
	/**
	 * @desc Angular Input Decorator - Common Parameters
	 * @param array renderFields - array of fields data.
	 * @param string type - type of the layout.
	 * @param form form - form control of the layout.
	 */
	@Input() fieldList: any = [];
	@Input() config: any = {};
	@Input() formObjectData: {
		form: FormGroup | null,
		fields: Array<any>
	} = {
			form: null,
			fields: []
		};
	@Input() loader = true;
	form!: FormGroup;

	/**
	 * @desc Angular Output Decorator - Common Parameters
	 * @param {object} formObject - builded final fields data.
	 * @param {object} helpLineEmit - help line json data.
	 * @param {object} fieldIconEmit - field icon json data.
	 */
	@Output() formObject = new EventEmitter();
	@Output() helpLineEmit = new EventEmitter();
	@Output() fieldIconEmit = new EventEmitter();
	@Output() fieldTrigger: any = new EventEmitter();
	@Output() search: any = new EventEmitter();
	@Output() selectedCategory = new EventEmitter();
	@Output() filterData = new EventEmitter();
	@Output() clear: any = new EventEmitter();
	@Output() removed = new EventEmitter();
	@Output() multiTypeUploadRemoved = new EventEmitter();
	@Output() multiTypeUploadDropped = new EventEmitter();

	// fxFlex;
	clearTimeOut: any;
	subscribe: Subscription | null = null;

	constructor(private controlService: BuilderService, private appInit: AppInitService) { }

	ngOnInit() {
		this.subscribe = this.controlService.formFieldsChange.subscribe(resp => {
			if (this.form && this.fieldList.length) {
				if (resp.oldFields.length) {
					for (const fieldColumn of resp.oldFields) {
						this.fieldList = this.fieldList.filter((items: any) => items.fieldColumn !== fieldColumn);
						this.form.removeControl(fieldColumn);
					}
					this.formObject.emit({ form: this.form, fields: this.fieldList });
				}
				if (resp.newFields.length) {
					for (const field of resp.newFields) {
						this.controlService.fieldModelBuilder(field);
						this.fieldList.push(field);
						this.form.addControl(field.fieldColumn, this.controlService.controlBuilder(field));
					}
					this.formObject.emit({ form: this.form, fields: this.fieldList });
				}
			}
		});
	}

	ngOnChanges(changes: SimpleChanges) {
		// if (changes.hasOwnProperty('form')) {
		//   if (([null, undefined].includes(changes.form.currentValue))) {
		//     this.loader = true;
		//   } else {
		//     this.loader = false;
		//   }
		// }
		if (changes.hasOwnProperty('fieldList') && changes.fieldList.currentValue.length) {
			const fields: any = changes.fieldList.currentValue;
			this.form = this.controlService.formGroupBuilder(fields);
			this.formObjectData.fields = this.formObjectData.fields.concat(fields);
			if (!this.formObjectData.form) {
				this.formObjectData.form = this.form;
			} else {
				for (const field of fields) {
					this.formObjectData.form.addControl(field.fieldColumn, this.form.get(field.fieldColumn));
				}
			}

			this.formObject.emit({ form: this.form, fields });
			for (const field of fields) {
				if (field.additionalMetaData.changeEventEmit) {
					let value = this.form.controls[field.fieldColumn].value;
					this.form.controls[field.fieldColumn].valueChanges.subscribe((resp) => {
						if (this.clearTimeOut) {
							clearTimeout(this.clearTimeOut);
						}
						if (this.form.controls[field.fieldColumn].valid) {
							this.clearTimeOut = setTimeout((): boolean | void => {
								if (resp !== null) {
									if (resp === value) {
										return false;
									}
									value = resp;
									this.fieldTrigger.emit({
										fieldData: resp,
										field
									});
								} else {
									value = null;
								}
							}, this.getTimeDelay(field));
						}
					});
				}
			}
			this.loader = false;
		}
	}

	getTimeDelay(field: any) {
		switch (field.fieldType) {
			case 'textBox':
				return 0;
			case 'dropDown':
				if (field.isMultiple) {
					return this.appInit.configuration.searchDelay;
				}
				return 0;
			case 'autoComplete':
				return 0;
			default: return null;
		}
	}

	ngAfterViewInit() { }

	getFlexOptions() {
		return '1 1 200px';
	}

	fieldIconData(record: any) {
		this.fieldIconEmit.emit(record);
	}

	helpLineData(record: any) {
		this.helpLineEmit.emit(record);
	}

	removedEmit(record: any) {
		this.removed.emit(record);
	}

	multiTypeUploadRemovedEmit(event: any) {
		this.multiTypeUploadRemoved.emit(event);
	}

	multiTypeUploadDroppedEmit(event: any) {
		this.multiTypeUploadDropped.emit(event);
	}

	ngOnDestroy() {
		if (this.subscribe) {
			this.subscribe.unsubscribe();
		}
	}
}
