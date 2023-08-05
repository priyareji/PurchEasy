import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FunctionsService } from '../utilities/services/functions.service';
import { InternationalPhNumberModel } from '../utilities/models/international-ph-number-model';
import { LocaleService } from '@app/shared/services/locale.service';
import { HandleBarPipe } from '@app/shared/pipes/handle-bar/handle-bar.pipe';

@Component({
	selector: 'app-international-phone-number',
	templateUrl: './international-phone-number.component.html',
	styleUrls: ['./international-phone-number.component.scss']
})
export class InternationalPhoneNumberComponent implements OnInit {

	/**
	 * @desc Angular Input Decorator - Common Parameters
	 * @param object field - Phone number field data.
	 * @param formControl control - Phone number field control.
	 */
	@Input() field!: InternationalPhNumberModel;
	@Input() control!: FormControl;

	/**
	 * @desc Angular Output Decorator - Common Parameters
	 * @param object helpLineEmit - help line json data.
	 */
	@Output() helpLineEmit = new EventEmitter();
	constructor(
		public controlFunctions: FunctionsService,
		public locale: LocaleService,
		private handleBarPipe: HandleBarPipe,
		private el: ElementRef
	) { }

	ngOnInit() {
	}

	/**
	 * @desc To remove the white spaces
	 * @param InputEvent event - Input event.
	 * @param formFieldJson formField - Input field json data.
	 */
	removeSpace(event: any, formField: any) {
		if (formField !== undefined) {
			if (formField.hasOwnProperty('type') && formField.type === 'number') {
				const replace = /[a-zA-Z+]/gi;
				this.control.patchValue(event.target.value.replace(replace, '').trim());
			} else if (formField.fieldType === 'textBox') {
				const replace = /^\s+|(\s{2,})/gi;
				this.control.patchValue(event.target.value.replace(replace, ''));
			} else {
				const replace = /[a-zA-z&\/\\#,+()$~%.'":*?<>{}@!=|;^-]/gi;
				this.control.patchValue(event.target.value.replace(replace, '').trim());
			}
		}
	}

	/**
	 * @desc To set initial country value and valid phone number
	 * @param InternationalPhoneNumberObject obj - Initial country field value.
	 * @param formFieldJson field - Input field json data.
	 */
	telInputObject(obj: any, field: any) {
		if (field.additionalMetaData.country) {
			obj.setCountry(field.additionalMetaData.country);
		} else {
			obj.setCountry('us');
		}
		const input: HTMLInputElement = this.el.nativeElement.querySelector('input');
		if (input && obj.hasOwnProperty('a')) {
			input.setAttribute('valid-number', obj.a.placeholder);
			field.additionalMetaData.validNumber = obj.a.placeholder;
			input.placeholder = obj.a.placeholder;
		}
	}

	/**
	 * @desc To set valid phone number and errors
	 * @param InternationalPhoneNumberChangeEvent obj - Initial country field value.
	 * @param formFieldJson field - Input field json data.
	 */
	intlChange(event: any, field: any) {
		const preferredField: HTMLInputElement | null = this.el.nativeElement.querySelector('input');
		if (preferredField) {
			field.additionalMetaData.validNumber = preferredField.getAttribute('valid-number');
			if (field.additionalMetaData.validNumber != null) {
				const numberData: any = field.additionalMetaData.validNumber.replace(/[a-zA-z&\/\\#,+()$~%.'":*?<>{}@!=|;^-]/gi, '').trim();
				if (numberData !== '') {
					field.additionalMetaData.validNumber = numberData.replace(/\s/g, '').trim();
				}
			}
		}
		if (!event) {
			if (!([null, undefined, ''].includes(this.control.value))) {
				this.control.setErrors({
					internationalPhoneNumber: {
						msg: this.handleBarPipe.transform(this.locale.translate('valid_phone_number'), {
							number: field.additionalMetaData.validNumber
						}),
						validNumber: field.additionalMetaData.validNumber,
					}
				});
			}
		} else {
			if (([null, undefined, ''].includes(this.control.value)) && field.isRequired) {
				this.control.setErrors({ required: true });
			} else {
				this.control.setErrors(null);
			}
		}
	}

	/**
	 * @desc To set valid phone number
	 * @param CountryChangeEvent obj - country change value.
	 * @param formFieldJson field - Input field json data.
	 */
	intlCountryChange(event: any, field: any) {
		const preferredField: HTMLInputElement = this.el.nativeElement.querySelector('input');
		if ([null, undefined, ''].includes(field.additionalMetaData)) {
			field.additionalMetaData = {};
		}
		if (preferredField) {
			preferredField.setAttribute('valid-number', preferredField.getAttribute('placeholder') || '');
			field.additionalMetaData.validNumber = (preferredField.getAttribute('valid-number') || '').replace(/\s/g, '').trim();
		}
		field.additionalMetaData.country = event.iso2;
		this.control.markAsUntouched();
	}

	/**
	 * @desc Help line field change method
	 * @param object helpLineEmit - help line json data.
	 */
	helpLineData(data: any) {
		this.helpLineEmit.emit(data);
	}

}
