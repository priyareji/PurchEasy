import { SuperModel, FieldConfig } from './super-model';

export class OwlDatePickerModel extends SuperModel {
	additionalMetaData: MetadataBuilder = {};
	isReadonly: boolean = false;
	isHidden: boolean = false;
	fieldType!: FieldType;
	fieldColumn: string = '';
	isRequired: boolean = false;
	constructor(
		field: any
	) {
		super(field);
		this.isRequired = field.isRequired;
		this.isHidden = field.isHidden;
		this.isReadonly = field.isReadonly;
		this.additionalMetaData = field.additionalMetaData;
		if (!this.additionalMetaData) {
			this.additionalMetaData = {};
		}
		if (!this.additionalMetaData.hasOwnProperty('startAt')) {
			this.additionalMetaData.startAt = null;
		}
		if (!this.additionalMetaData.hasOwnProperty('startView')) {
			this.additionalMetaData.startView = 'month';
		}
		if (!this.additionalMetaData.hasOwnProperty('pickerType')) {
			this.additionalMetaData.pickerType = 'both';
		}
		if (!this.additionalMetaData.hasOwnProperty('pickerMode')) {
			this.additionalMetaData.pickerMode = 'popup';
		}
		if (!this.additionalMetaData.hasOwnProperty('selectMode')) {
			this.additionalMetaData.selectMode = 'single';
		}
		if (!this.additionalMetaData.hasOwnProperty('rangeSeparator')) {
			this.additionalMetaData.rangeSeparator = '~';
		}
		if (!this.additionalMetaData.hasOwnProperty('minDate')) {
			this.additionalMetaData.minDate = null;
		}
		if (!this.additionalMetaData.hasOwnProperty('maxDate')) {
			this.additionalMetaData.maxDate = null;
		}
		if (!this.additionalMetaData.hasOwnProperty('showLabel')) {
			this.additionalMetaData.showLabel = true;
		}
		if (!this.additionalMetaData.hasOwnProperty('panelClass')) {
			this.additionalMetaData.panelClass = '';
		}
		if (!this.additionalMetaData.hasOwnProperty('changeEventEmit')) {
			this.additionalMetaData.changeEventEmit = true;
		}
	}
}

type FieldType = 'owlDate';

interface MetadataBuilder {
	startAt?: number | null;
	startView?: StartView;
	pickerType?: PickerType;
	pickerMode?: PickerMode;
	rangeSeparator?: string;
	meridiemFormat?: boolean;
	selectMode?: SelectMode;
	minDate?: number | Date | null;
	maxDate?: number | Date | null;
	showLabel?: boolean;
	panelClass?: Array<string> | string;
	fieldConfig?: FieldConfig;
	changeEventEmit?: boolean;
}

type StartView = 'month' | 'year' | 'multi-year';

type PickerType = 'both' | 'calendar' | 'timer';

type PickerMode = 'popup' | 'dialog';

type SelectMode = 'single' | 'range' | 'rangeFrom' | 'rangeTo';
