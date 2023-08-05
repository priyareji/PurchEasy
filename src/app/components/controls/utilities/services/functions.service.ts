import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HandleBarPipe } from '@app/shared/pipes/handle-bar/handle-bar.pipe';
import { LocaleService } from '@app/shared/services/locale.service';

@Injectable()
export class FunctionsService {

	datePicker: boolean = false;
	datePickerIndex!: number;
	constructor(
		private locale: LocaleService
	) { }

	/**
	 * @desc Customvalidation message for the form controls.
	 * @param FormControl ctrl - Router link.
	 * @param json renderFields - form build json data.
	 * @returns HTMLElement.
	 */
	validationMsg(ctrl: any, renderField: any): string | void {
		if (ctrl.errors) {
			if (ctrl.errors.required) {
				return '<span>' + this.locale.translate('this_field_is_required') + ' </span>';
			} else if (ctrl.errors.pattern) {
				return '<span>' + renderField.validationMessage + '</span>';
			} else if (ctrl.errors.minlength) {
				return '<span> ' + new HandleBarPipe().transform(this.locale.translate('minimum_length_required'), { length: ctrl.errors.minlength.requiredLength }) + '</span>';
			} else if (ctrl.errors.maxlength) {
				return '<span> ' + new HandleBarPipe().transform(this.locale.translate('maximum_length_required'), { length: ctrl.errors.maxlength.requiredLength }) + '</span>';
			} else if (ctrl.errors.min) {
				return '<span> ' + new HandleBarPipe().transform(this.locale.translate('minimum_value_allowed'), { min: ctrl.errors.min.min }) + '</span>';
			} else if (ctrl.errors.max) {
				return '<span> ' + new HandleBarPipe().transform(this.locale.translate('maximum_value_allowed'), { max: ctrl.errors.max.max }) + '</span>';
			} else if (ctrl.errors.incorrect && typeof ctrl.errors.incorrect === 'object') {
				return '<span>' + ctrl.errors.incorrect.msg + '</span>';
			} else if (ctrl.errors.rangeDateTime && typeof ctrl.errors.rangeDateTime === 'object') {
				return '<span>' + ctrl.errors.rangeDateTime.msg + '</span>';
			} else if (ctrl.errors.fileUploadExtension && typeof ctrl.errors.fileUploadExtension === 'object') {
				return '<span>' + ctrl.errors.fileUploadExtension.msg + '</span>';
			} else if (ctrl.errors.fileUploadSize && typeof ctrl.errors.fileUploadSize === 'object') {
				return '<span>' + ctrl.errors.fileUploadSize.msg + '</span>';
			} else if (ctrl.errors.imageMinWidth && typeof ctrl.errors.imageMinWidth === 'object') {
				return '<span>' + ctrl.errors.imageMinWidth.msg + '</span>';
			} else if (ctrl.errors.imageMaxWidth && typeof ctrl.errors.imageMaxWidth === 'object') {
				return '<span>' + ctrl.errors.imageMaxWidth.msg + '</span>';
			} else if (ctrl.errors.imageMinHeight && typeof ctrl.errors.imageMinHeight === 'object') {
				return '<span>' + ctrl.errors.imageMinHeight.msg + '</span>';
			} else if (ctrl.errors.imageMaxHeight && typeof ctrl.errors.imageMaxHeight === 'object') {
				return '<span>' + ctrl.errors.imageMaxHeight.msg + '</span>';
			} else if (ctrl.errors.internationalPhoneNumber && typeof ctrl.errors.internationalPhoneNumber === 'object') {
				return '<span>' + ctrl.errors.internationalPhoneNumber.msg + '</span>';
			} else if (ctrl.errors.dataAlreadyExist && typeof ctrl.errors.dataAlreadyExist === 'object') {
				return '<span>' + ctrl.errors.dataAlreadyExist.msg + '</span>';
			} else if (ctrl.errors.mustMatch && typeof ctrl.errors.mustMatch === 'object') {
				return '<span>' + ctrl.errors.mustMatch.msg + '</span>';
			} else if (ctrl.errors.file && typeof ctrl.errors.file === 'object') {
				return '<span>' + ctrl.errors.file.message + '</span>';
			} else if (ctrl.errors.owlDateTimeMax) {
				return `<span>${this.locale.translate('invalid_date')}</span>`;
			} else if (ctrl.errors.owlDateTimeMin) {
				return `<span>${this.locale.translate('invalid_date')}</span>`;
			} else if (ctrl.errors.file && typeof ctrl.errors.file === 'object') {
				return '<span>' + ctrl.errors.file.message + '</span>';
			} else if (ctrl.errors.fileUploadSize && typeof ctrl.errors.fileUploadSize === 'object') {
				return '<span>' + ctrl.errors.fileUploadSize.msg + '</span>';
			} else if (ctrl.errors.arrayLength && typeof ctrl.errors.arrayLength === 'object') {
				return '<span>' + ctrl.errors.arrayLength.message + '.</span>';
			} else if (ctrl.errors.autoComplete && typeof ctrl.errors.autoComplete === 'object') {
				return '<span>' + ctrl.errors.autoComplete.msg + '</span>';
			} else if (ctrl.errors.fileUploadExtension && typeof ctrl.errors.fileUploadExtension === 'object') {
				return '<span>' + ctrl.errors.fileUploadExtension.msg + '</span>';
			} else if (ctrl.errors.fileUploadSize && typeof ctrl.errors.fileUploadSize === 'object') {
				return '<span>' + ctrl.errors.fileUploadSize.msg + '</span>';
			} else if (ctrl.errors.autoComplete && typeof ctrl.errors.autoComplete === 'object') {
				return '<span>' + ctrl.errors.autoComplete.msg + '</span>';
			} else if (ctrl.errors.mustMatch && typeof ctrl.errors.mustMatch === 'object') {
				return '<span>' + new HandleBarPipe().transform(this.locale.translate('not_matched'), { caption: renderField.fieldCaption }) + '</span>';
			}
		}
	}


	/**
	 * @desc Resetting the form / control.
	 * @param form form - Form / FormControl.
	 */
	resetValue(form: FormControl): void {
		if (form) {
			form.reset();
			form.markAsTouched();
		}
	}
}
