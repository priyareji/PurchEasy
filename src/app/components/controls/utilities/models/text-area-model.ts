import { SuperModel, FieldConfig } from './super-model';

export class TextAreaModel extends SuperModel {
	validationRegex;
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
		if (!this.additionalMetaData.hasOwnProperty('minChar')) {
			this.additionalMetaData.minChar = null;
		}
		if (!this.additionalMetaData.hasOwnProperty('maxChar')) {
			this.additionalMetaData.maxChar = null;
		}
		if (!this.additionalMetaData.hasOwnProperty('capLock')) {
			this.additionalMetaData.capLock = false;
		}
		if (!this.additionalMetaData.hasOwnProperty('showLabel')) {
			this.additionalMetaData.showLabel = true;
		}
		if (!this.additionalMetaData.hasOwnProperty('minRows')) {
			this.additionalMetaData.minRows = 3;
		}
		if (!this.additionalMetaData.hasOwnProperty('maxRows')) {
			if (this.additionalMetaData.minRows)
				this.additionalMetaData.maxRows = this.additionalMetaData.minRows + 5;
		}
		if (!this.additionalMetaData.hasOwnProperty('resize')) {
			this.additionalMetaData.resize = false;
		}
		if (!this.additionalMetaData.hasOwnProperty('changeEventEmit')) {
			this.additionalMetaData.changeEventEmit = true;
		}
		this.validationRegex = (field.hasOwnProperty('validationRegex')
			&& !([null, undefined, ''].includes(field.validationRegex))) ? field.validationRegex : null;
	}
}

type FieldType = 'textArea';

interface MetadataBuilder {
	minRows?: number;
	maxRows?: number;
	resize?: boolean;
	minChar?: number | null;
	maxChar?: number | null;
	capLock?: boolean;
	showLabel?: boolean;
	fieldConfig?: FieldConfig;
	changeEventEmit?: boolean;
}
