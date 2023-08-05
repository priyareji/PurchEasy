import { SuperModel, FieldConfig, Autofill, FieldIcon } from './super-model';

export class AutoCompleteModel extends SuperModel {
	options: Array<Options> = [];
	isReadonly: boolean = false;
	isHidden: boolean = false;
	isMultiple: boolean;
	fieldType!: FieldType;
	fieldColumn: string = '';
	isRequired: boolean = false;
	additionalMetaData: MetadataBuilder = {};
	selectedValue: Array<SelectedValue>;
	preDefined?: boolean;
	validationRegex?: string;
	validationMessage?: string;
	type?: 'general' = 'general';
	fieldIcon?: FieldIcon;
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
		this.options = (field.hasOwnProperty('options')
			&& !([null, undefined, ''].includes(field.options))) ? field.options : [];
		this.isMultiple = (field.hasOwnProperty('isMultiple')
		) ? field.isMultiple : false;
		if (this.isMultiple) {
			if (!this.additionalMetaData.hasOwnProperty('activeFirstOption')) {
				this.additionalMetaData.activeFirstOption = false;
			}
		}
		if (!field.hasOwnProperty('type')) {
			field.type = 'general';
		}
		if (!this.additionalMetaData.hasOwnProperty('showLabel')) {
			this.additionalMetaData.showLabel = true;
		}
		if (!field.hasOwnProperty('preDefined')) {
			field.preDefined = true;
		}
		if (!this.additionalMetaData.hasOwnProperty('autoFill')) {
			this.additionalMetaData.autoFill = 'on';
		}
		if (!this.additionalMetaData.hasOwnProperty('changeEventEmit')) {
			this.additionalMetaData.changeEventEmit = true;
		}
		// if (!this.additionalMetaData.hasOwnProperty('maxWeightage')) {
		// 	this.additionalMetaData.maxWeightage = 5;
		// } else if (Array.isArray(this.additionalMetaData.maxWeightage) && this.additionalMetaData.maxWeightage.length) {
		// 	field.additionalMetaData.maxWeightage = [{
		// 		key: null,
		// 		value: 'None',
		// 		weightage: 0
		// 	}].concat(field.additionalMetaData.maxWeightage);
		// }
		// if (!this.additionalMetaData.hasOwnProperty('defaultWeightage')) {
		// 	this.additionalMetaData.defaultWeightage = 1;
		// }
		// if (!this.additionalMetaData.hasOwnProperty('minWeightage')) {
		// 	this.additionalMetaData.minWeightage = 0;
		// }
		if (!this.additionalMetaData.hasOwnProperty('showHelp')) {
			this.additionalMetaData.showHelp = false;
		}
		if (!this.additionalMetaData.hasOwnProperty('loadOptions')) {
			this.additionalMetaData.loadOptions = true;
		}
		this.selectedValue = (field.hasOwnProperty('selectedValue')
			&& !([null, undefined, ''].includes(field.selectedValue))) ? field.selectedValue : [];
	}
}

type FieldType = 'autoComplete';

interface MetadataBuilder {
	activeFirstOption?: boolean;
	showLabel?: boolean;
	autoFill?: Autofill;
	fieldConfig?: FieldConfig;
	changeEventEmit?: boolean;
	maxWeightage?: number | Array<{
		key: any;
		value: string;
		weightage?: number;
		description?: string;
	}>;
	defaultWeightage?: number;
	minWeightage?: number;
	max?: number;
	showHelp?: boolean;
	min?: number;
	separatorKeysCodes?: number[];
	loadOptions?: boolean;
}

interface Options {
	key: string | number | {};
	value: string | number;
	prefix?: {
		type: 'image' | 'icon' | 'svgIcon';
		tooltip: string;
		value: string;
	};
	suffix?: {
		type: 'icon';
		tooltip: string;
		value: string;
	};
	// weightage?: number;
	// expectedWeightage?: number;
	shortInfo?: Array<{
		value: string;
	}>;
}

interface SelectedValue {
	key?: string | number | {};
	value: any;
	isDelete?: boolean;
	isAdd?: boolean;
	weightage?: number;
	expectedWeightage?: number;
}
