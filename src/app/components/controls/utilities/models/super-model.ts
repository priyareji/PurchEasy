export class SuperModel {
	value?: any;
	isRequired?: boolean;
	isHidden?: boolean;
	isReadonly?: boolean;
	fieldOrder?: number;
	fieldType?: FieldTypes;
	fieldCaption?: string;
	fieldPlaceholder?: string;
	fieldHelpText?: string;
	fieldHelpTextLong?: string;
	additionalMetaData?: any;
	fieldColumn?: string;
	validationMessage?: string;
	helpLine?: Array<HelpLineBuilder>;
	constructor(builderData: FieldBuilder) {
		this.value = (builderData.hasOwnProperty('value')
			&& !([null, undefined, ''].includes(builderData.value))) ? builderData.value : null;

		this.fieldCaption = (builderData.hasOwnProperty('fieldCaption')
			&& !([null, undefined, ''].includes(builderData.fieldCaption))) ? builderData.fieldCaption : '';

		this.fieldPlaceholder = (builderData.hasOwnProperty('fieldPlaceholder')
			&& !([null, undefined, ''].includes(builderData.fieldPlaceholder))) ? builderData.fieldPlaceholder : '';

		this.fieldColumn = (builderData.hasOwnProperty('fieldColumn')
			&& !([null, undefined, ''].includes(builderData.fieldColumn))) ? builderData.fieldColumn : 'fieldName';

		this.isRequired = (builderData.hasOwnProperty('isRequired')
			&& (builderData.isRequired)) ? builderData.isRequired : false;

		this.isReadonly = (builderData.hasOwnProperty('isReadonly')
			&& (builderData.isReadonly)) ? builderData.isReadonly : false;

		this.isHidden = (builderData.hasOwnProperty('isHidden')
			&& (builderData.isHidden)) ? builderData.isHidden : false;

		this.fieldOrder = (builderData.hasOwnProperty('fieldOrder')
			&& (builderData.fieldOrder)) ? builderData.fieldOrder : 0;

		this.fieldType = (builderData.hasOwnProperty('fieldType')
			&& (builderData.fieldType)) ? builderData.fieldType : null;

		this.fieldHelpText = (builderData.hasOwnProperty('fieldHelpText')
			&& !([null, undefined, ''].includes(builderData.fieldHelpText))) ? builderData.fieldHelpText : '';

		this.additionalMetaData = (builderData.hasOwnProperty('additionalMetaData')
			&& (builderData.additionalMetaData)) ? builderData.additionalMetaData : {};

		this.validationMessage = (builderData.hasOwnProperty('validationMessage')
			&& !([null, undefined, ''].includes(builderData.validationMessage))) ? builderData.validationMessage : '';

		this.helpLine = (builderData.hasOwnProperty('helpLine')
			&& Array.isArray(builderData.helpLine)) ? builderData.helpLine : [];
	}
}

// Help line field json
export interface HelpLineBuilder {
	type?: string;
	icon?: string;
	caption?: string;
	method?: string;
	link?: string;
	target?: string;
}

// Form meta data json
export interface FormMetaDataBuilder {
	formId?: number;
	formTitle?: string;
	formDescription?: string;
	fieldGroup?: Array<FormGroupBuilder>;
}

// Form group json
export interface FormGroupBuilder {
	fieldGroupId?: number;
	FieldGroupName?: string;
	FieldGroupDescription?: string;
	FieldList?: Array<FieldBuilder>;
}

// Additional meta data json
export interface AddionalMetadataBuilder {
	minChar?: number;
	maxChar?: number;
	min?: number;
	max?: number;
	capLock?: boolean;
	country?: string;
	customDateClasses?: Array<CustomDateClasses>;
	startAt?: number;
	startView?: StartView;
	touchUi?: boolean;
	minDate?: number | Date;
	maxDate?: number | Date;
	activeFirstOption?: boolean;
	supportedType?: string | Array<string>;
	fileSize?: number | string;
	thumbnailMaxSize?: string;
	thumbnailFormat?: string | Array<string>;
	isNone?: boolean;
	showLabel?: boolean;
	formatter?: string;
	fieldConfig?: FieldConfig;
	changeEventEmit?: boolean;
}

// Custom Date Classes
export interface CustomDateClasses {
	year?: number;
	month?: number;
	date: number;
}

// All possibe field configuration keys
export interface Options {
	key?: string | number | {};
	value?: string | number;
	disabled?: boolean;
	options?: Array<Options>;
	groupName?: string;
	prefix?: {
		type: 'image' | 'icon';
		tooltip: string;
		value: string;
	};
	suffix?: {
		type: 'icon';
		tooltip: string;
		value: string;
	};
}

// Field icon for text box
export interface FieldIcon {
	prefix?: {
		icon?: string,
		method?: string,
		caption?: string,
		disabled?: boolean
	};
	suffix?: {
		icon?: string,
		method?: string,
		caption?: string,
		disabled?: boolean
	};
}

// All possibe field keys
export interface FieldBuilder {
	value?: any;
	isRequired: boolean;
	isReadonly: boolean;
	isHidden: boolean;
	fieldOrder?: number;
	fieldType: FieldTypes;
	fieldCaption?: string;
	fieldPlaceholder?: string;
	fieldHelpText?: string;
	additionalMetaData?: AddionalMetadataBuilder;
	fieldColumn: string;
	validationMessage?: string;
	helpLine?: Array<HelpLineBuilder>;
	validationRegex?: string;
	options?: Array<any> | any;
	type?: string;
	fieldIcon?: FieldIcon;
	selectedValue?: Array<Options> | Array<string>;
	preDefined?: boolean;
}

// All possibe field configuration keys
export interface FieldConfig {
	floatLabel?: FloatLabel;
	appearance?: Appearance;
	fxFlex?: number | string;
}

export type FloatLabel = 'auto' | 'always';

export type Appearance = 'standard';

export type FieldTypes = 'textBox' | 'textArea' | 'dropDown' | 'internationalPhoneNumber'
	| 'date' | 'checkBox' | 'radio' | 'autoComplete' | 'fileUpload' | 'imageCrop' | 'owlDate' | 'rating' | 'embed' | 'advancedSearch' | 'multiTypeUpload' | 'imageUpload' | 'skillsSelectionField' | 'quillEditor';

export type StartView = 'month' | 'year' | 'multi-year';

export type Autofill = 'on' | 'off';
// export enum FieldType {
//   textBox = 'textBox',
//   textArea = 'textArea',
//   autoComplete = 'autoComplete',
//   date = 'date',
//   radio = 'radio',
//   dropDown = 'dropDown',
//   internationalPhoneNumber = 'internationalPhoneNumber',
//   checkbox = 'checkbox',
//   file = 'file'
// }
