import { SuperModel } from './super-model';
import { TextBoxModel } from './text-box-model';
import { TextAreaModel } from './text-area-model';
import { DropDownModel } from './drop-down-model';
import { OwlDatePickerModel } from './owl-date-picker-model';
import { AutoCompleteModel } from './auto-complete-model';

export class AdvancedSearchModel extends SuperModel {
	isReadonly: boolean = false;
	isHidden: boolean = false;
	fieldType!: FieldType;
	fieldColumn!: string;
	additionalMetaData: MetadataBuilder = {};
	category!: {
		filterColumn?: string,
		data: Array<CategoryOptions>,
		value?: SelectedValue | null
	};
	isRequired = false;
	options: Array<{
		key?: any;
		value?: string;
		groupName?: string;
		disabled?: boolean;
		options?: Array<{
			key: any;
			value: string;
			disabled?: boolean;
		}>;
	}> = [];
	selectedValue: Array<SelectedValue>;
	type?: 'general' | 'classic' = 'general';
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
		if (!field.hasOwnProperty('type')) {
			field.type = 'general';
		}
		field.isRequired = false;
		if (!this.additionalMetaData.hasOwnProperty('capLock')) {
			this.additionalMetaData.capLock = false;
		}
		if (!this.additionalMetaData.hasOwnProperty('showLabel')) {
			this.additionalMetaData.showLabel = true;
		}
		if (!this.additionalMetaData.hasOwnProperty('disablePaste')) {
			this.additionalMetaData.disablePaste = false;
		}
		if (!this.additionalMetaData.hasOwnProperty('changeEventEmit')) {
			this.additionalMetaData.changeEventEmit = true;
		}
		this.selectedValue = (field.hasOwnProperty('selectedValue')
			&& !([null, undefined, ''].includes(field.selectedValue))) ? field.selectedValue : [];
	}
}

interface CategoryOptions {
	key: any;
	value: any;
}

type FieldType = 'advancedSearch';

interface MetadataBuilder {
	capLock?: boolean;
	showLabel?: boolean;
	disablePaste?: boolean;
	changeEventEmit?: boolean;
	filter?: Array<TextBoxModel | TextAreaModel | DropDownModel | OwlDatePickerModel | AutoCompleteModel>;
	textBased?: boolean;
}

interface SelectedValue {
	key?: string | number | {};
	value: string;
	isDelete?: boolean;
	isAdd?: boolean;
}
