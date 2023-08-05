import { Injectable } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { TextBoxModel } from '../models/text-box-model';
import { TextAreaModel } from '../models/text-area-model';
import { DropDownModel } from '../models/drop-down-model';
import { RadioModel } from '../models/radio-model';
import { CheckBoxModel } from '../models/check-box-model';
import { FileUploadModel } from '../models/file-upload-model';
import { DatePickerModel } from '../models/date-picker-model';
import { InternationalPhNumberModel } from '../models/international-ph-number-model';
import { AutoCompleteModel } from '../models/auto-complete-model';
import { ArrayLength } from '../../addons/validators/array-length.validator';
import { FieldBuilder, FormMetaDataBuilder } from '../models/super-model';
import { OwlDatePickerModel } from '../models/owl-date-picker-model';
import { ImageCropModel } from '../models/image-crop-model';
import { MatRatingModel } from '../models/mat-rating-model';
import { File } from '../../addons/validators/file.validator';
import { HandleBarPipe } from '@app/shared/pipes/handle-bar/handle-bar.pipe';
// import { AudioUploadModel } from '../models/audio-upload-model';
import { Subject } from 'rxjs';
import { AdvancedSearchModel } from '../models/advanced-search-model';
import { AppInitService } from '@app/app-initializer.service';
import { MultiTypeUploadModel } from '../models/multi-type-upload-model';
import { ImageUploadModel } from '../models/image-upload-model';
import { QuillEditorModel } from '../models/quill-editor-model';

@Injectable()
export class BuilderService {

	formFieldsChange = new Subject<{
		oldFields: Array<string>, newFields: Array<FieldBuilder>
	}>();

	constructor(
		private preLoadService: AppInitService
	) { }

	/**
	 * @desc To create form groups and controls for form fields.
	 * @param object formFields - form fields json data.
	 * @return new form group.
	 */
	formGroupBuilder(formFields: Array<FieldBuilder>) {
		const group: any = {};
		for (const field of formFields) {
			const controller = this.controlBuilder(this.fieldModelBuilder(field));
			if (controller) {
				group[field.fieldColumn] = controller;
			}
		}
		return new FormGroup(group);
	}

	/**
	 * @desc To create form controls using form field.
	 * @param object field - form field json data.
	 * @return new form control.
	 */
	controlBuilder(field: any): FormControl | FormArray {
		const validations = [];
		if (!(['', null, undefined].includes(field.validationRegex))) {
			validations.push(Validators.pattern(field.validationRegex));
		}
		if (field.isRequired === true) {
			validations.push(Validators.required);
		}
		if (field.additionalMetaData) {
			if (field.additionalMetaData.hasOwnProperty('min') && !([null, undefined].includes(field.additionalMetaData.min))) {
				validations.push(Validators.min(field.additionalMetaData.min));
			}
			if (field.additionalMetaData.hasOwnProperty('max') && !([null, undefined].includes(field.additionalMetaData.max))) {
				validations.push(Validators.max(field.additionalMetaData.max));
			}
			if (field.additionalMetaData.hasOwnProperty('minChar') && !([null, undefined].includes(field.additionalMetaData.minChar))) {
				validations.push(Validators.minLength(field.additionalMetaData.minChar));
			}
			if (field.additionalMetaData.hasOwnProperty('maxChar') && !([null, undefined].includes(field.additionalMetaData.maxChar))) {
				validations.push(Validators.maxLength(field.additionalMetaData.maxChar));
			}
			if (['fileUpload', 'multiTypeUpload'].includes(field.fieldType)) {
				const fileType = [];
				let fileSize = 1024;
				if (field.additionalMetaData.hasOwnProperty('supportedType')
					&& !([null, undefined].includes(field.additionalMetaData.supportedType))) {
					fileType.push(field.additionalMetaData.supportedType);
				}
				if (field.additionalMetaData.hasOwnProperty('fileSize') && !([null, undefined].includes(field.additionalMetaData.fileSize))) {
					fileSize = field.additionalMetaData.fileSize;
				}
				validations.push(File(
					fileType,
					fileSize,
					field
				));
			}
			if (field.fieldType === 'textBox' && field.additionalMetaData.hasOwnProperty('formatter')
				&& !([null, undefined].includes(field.additionalMetaData.formatter)) && !([null, undefined].includes(field.value))) {
				const stringFormatter = new HandleBarPipe();
				field.value = stringFormatter.transform(field.value, field.additionalMetaData.formatter);
			}
		}
		let isDisabled = false;
		if (field.isHidden === true || field.isReadonly === true) {
			isDisabled = true;
		}
		let controlValue = null;
		let control = null;
		if (field.fieldType === 'checkBox') {
			const min = (
				field.additionalMetaData.hasOwnProperty('min') &&
				!([null, undefined].includes(field.additionalMetaData.min))
			) ? field.additionalMetaData.min : 0;
			const max = (
				field.additionalMetaData.hasOwnProperty('max') &&
				!([null, undefined].includes(field.additionalMetaData.max))
			) ? field.additionalMetaData.max : null;
			const controlArr = new FormArray(
				[],
				ArrayLength(min, max)
			);
			if (field.options.length) {
				controlValue = [];
				let currentValue = [];
				if (typeof field.value === 'string') {
					currentValue = field.value.split(',');
				} else if (typeof field.value === 'object' && Array.isArray(field.value)) {
					currentValue = field.value;
				}
				for (const checkBox of field.options) {
					let isCheckBoxDisabled = false;
					if (checkBox.isHidden === true || checkBox.isReadonly === true || isDisabled) {
						isCheckBoxDisabled = true;
					}
					const value = (checkBox.key !== '' && currentValue.includes(checkBox.key)) ? checkBox.key : null;
					const controller = new FormControl({ value: value ? checkBox.key : null, disabled: isCheckBoxDisabled });
					controller.setErrors(null);
					controlArr.push(controller);
				}
			}
			control = controlArr;
			control.setErrors(null);
		} else {
			controlValue = (field.value !== '' || field.value === 0 || field.value === '0') ? field.value : null;
			control = new FormControl({ value: controlValue, disabled: isDisabled }, validations);
			control.setErrors(null);
		}
		return control;
	}

	/**
	 * @desc Build field model for given form groups.
	 * @param array formData - form groups.
	 * @return FormMetaDataBuilder - Form model.
	 */
	groupModelBuilder(formData: FormMetaDataBuilder) {
		if (formData.fieldGroup && formData.fieldGroup.length) {
			formData.fieldGroup.map(fieldGrpResp => {
				fieldGrpResp.FieldList = this.fieldModelArrayBuilder(fieldGrpResp.FieldList || []);
			});
		}
		return formData;
	}

	/**
	 * @desc Build field model for given field array.
	 * @param array fieldArr - field array.
	 * @return FieldBuilder[] - Field model as array.
	 */
	fieldModelArrayBuilder(fieldArr: Array<FieldBuilder>): Array<FieldBuilder> {
		fieldArr.map((FieldResp, index) => {
			const fieldModel = this.fieldModelBuilder(FieldResp);
			if (fieldModel) {
				fieldArr[index] = fieldModel;
			}
		});
		return fieldArr.sort((a, b) => (a.fieldOrder || 0) - (b.fieldOrder || 0));
	}

	/**
	 * @desc Build field model for given field.
	 * @param json field - field json.
	 * @return FieldBuilder - Field model.
	 */
	fieldModelBuilder(field: any): FieldBuilder | null {
		if (['textBox', 'textArea', 'dropDown', 'fileUpload', 'date', 'owlDate',
			'internationalPhoneNumber', 'autoComplete', 'embed', 'quillEditor', 'multiTypeUpload', 'imageUpload', 'skillsSelectionField'].includes(field.fieldType)) {
			if ([null, undefined].includes(field.additionalMetaData)) {
				field.additionalMetaData = {};
			}
			if ([null, undefined].includes(field.additionalMetaData.fieldConfig) ||
				(typeof field.additionalMetaData.fieldConfig === 'object') && Object.keys(field.additionalMetaData.fieldConfig).length === 0) {
				field.additionalMetaData.fieldConfig = {};
				field.additionalMetaData.fieldConfig = this.preLoadService.configuration.fieldConfig;
			} else if ([null, undefined].includes(field.additionalMetaData.fieldConfig.appearance)) {
				field.additionalMetaData.fieldConfig.appearance = this.preLoadService.configuration.fieldConfig.appearance;
			} else if ([null, undefined].includes(field.additionalMetaData.fieldConfig.floatLabel)) {
				field.additionalMetaData.fieldConfig.floatLabel = this.preLoadService.configuration.fieldConfig.floatLabel;
			}
		}
		switch (field.fieldType) {
			case 'textBox':
				return new TextBoxModel(field);
			case 'textArea':
				return new TextAreaModel(field);
			case 'dropDown':
				return new DropDownModel(field);
			case 'radio':
				return new RadioModel(field);
			case 'checkBox':
				return new CheckBoxModel(field);
			case 'fileUpload':
				return new FileUploadModel(field);
			case 'date':
				if (field.additionalMetaData !== null && field.additionalMetaData.hasOwnProperty('minDate')
					&& !([null, undefined, ''].includes(field.additionalMetaData.minDate))) {
					const minDate: Date = this.alteredDate('minus', field.additionalMetaData.minDate);
					field.additionalMetaData.minDate = minDate;
				}
				if (field.additionalMetaData !== null && field.additionalMetaData.hasOwnProperty('maxDate')
					&& !([null, undefined, ''].includes(field.additionalMetaData.maxDate))) {
					const maxDate: Date = this.alteredDate('plus', field.additionalMetaData.maxDate);
					field.additionalMetaData.maxDate = maxDate;
				}
				return new DatePickerModel(field);
			case 'owlDate':
				if (field.additionalMetaData !== null && field.additionalMetaData.hasOwnProperty('minDate')
					&& !([null, undefined, ''].includes(field.additionalMetaData.minDate))) {
					if (typeof field.additionalMetaData.minDate == 'number') {
						const minDate: Date = this.alteredDate('minus', field.additionalMetaData.minDate);
						field.additionalMetaData.minDate = minDate;
					}
				}
				if (field.additionalMetaData !== null && field.additionalMetaData.hasOwnProperty('maxDate')
					&& !([null, undefined, ''].includes(field.additionalMetaData.maxDate))) {
					if (typeof field.additionalMetaData.maxDate == 'number') {
						const maxDate: Date = this.alteredDate('plus', field.additionalMetaData.maxDate);
						field.additionalMetaData.maxDate = maxDate;
					}
				}
				if (!field.additionalMetaData.hasOwnProperty('meridiemFormat')) {
					field.additionalMetaData.meridiemFormat = this.preLoadService.configuration.meridiemFormat;
				}
				return new OwlDatePickerModel(field);
			case 'internationalPhoneNumber':
				if (field.hasOwnProperty('additionalMetaData')) {
					if (!field.additionalMetaData.hasOwnProperty('iso2')) {
						// FieldListResp.fieldAdditionalData['iso2'] = this.config.DEFAULT_COUNTRY;
					}
				}
				return new InternationalPhNumberModel(field);
			case 'autoComplete':
				return new AutoCompleteModel(field);
			case 'imageCrop':
				return new ImageCropModel(field);
			case 'quillEditor':
				return new QuillEditorModel(field);
			case 'rating':
				return new MatRatingModel(field);
			case 'advancedSearch':
				return new AdvancedSearchModel(field);
			case 'multiTypeUpload':
				return new MultiTypeUploadModel(field);
			case 'imageUpload':
				return new ImageUploadModel(field);
			default: return null;
		}
	}

	/**
	 * @desc Build multiple form groups.
	 * @param array formData - multiple form fields array of data.
	 * @return object - data which contain multiple form groups of control based given field array and field array.
	 */
	formBuilder(formData: FormMetaDataBuilder) {
		const fieldData: any = this.groupModelBuilder({ ...formData });
		const returnData: any = {};
		returnData.fields = { ...fieldData };
		const controlJson: any = {};
		if (fieldData.hasOwnProperty('fieldGroup') && fieldData.fieldGroup.length) {
			fieldData.fieldGroup.map((fieldGrpResp: any) => {
				// const fieldGenerate: any = [];
				const fieldGenerate: Array<FieldBuilder> = [];
				fieldGrpResp.FieldList.map((fieldResp: any) => {
					fieldGenerate.push(fieldResp);
				});
				controlJson['fieldGroup' + fieldGrpResp.fieldGroupId] = this.formGroupBuilder(fieldGenerate);
			});
		}
		returnData.controls = new FormGroup(controlJson);
		return returnData;
	}

	/**
		* @desc Alter the date from given date or current date by default.
		* @param string type - plus / minus.
		* @param string days - Numbers of days to alter from given date.
		* @param data fromDate - Start date.
		* @return Date - Altered Date.
		*/
	alteredDate(type: string = 'plus', days: number = 0, fromDate: Date = new Date()) {
		let dateInt;
		if (type === 'minus') {
			dateInt = fromDate.setDate(fromDate.getDate() - days);
			return new Date(dateInt);
		} else {
			dateInt = fromDate.setDate(fromDate.getDate() + days);
			return new Date(dateInt);
		}
	}
}
