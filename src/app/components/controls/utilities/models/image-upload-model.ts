import { SuperModel, FieldConfig } from './super-model';

export class ImageUploadModel extends SuperModel {
	isReadonly: boolean = false;
	isHidden: boolean = false;
	fieldType!: FieldType;
	fieldColumn: string = '';
	isRequired: boolean = false;
	additionalMetaData: MetadataBuilder = {};
	value!: Array<{
		file: any
	}>
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
		if (!this.additionalMetaData.hasOwnProperty('supportedType')) {
			this.additionalMetaData.supportedType = '';
		}
		if (!this.additionalMetaData.hasOwnProperty('fileSize')) {
			this.additionalMetaData.fileSize = '';
		}
		if (!this.additionalMetaData.hasOwnProperty('showLabel')) {
			this.additionalMetaData.showLabel = true;
		}
		if (!this.additionalMetaData.hasOwnProperty('changeEventEmit')) {
			this.additionalMetaData.changeEventEmit = true;
		}
		if (!this.additionalMetaData.hasOwnProperty('crop')) {
			this.additionalMetaData.crop = false;
		}
	}
}

type FieldType = 'imageUpload';

interface MetadataBuilder {
	supportedType?: string | Array<string>;
	fileSize?: number | string;
	showLabel?: boolean;
	fieldConfig?: FieldConfig;
	changeEventEmit?: boolean;
	thumbnail?: string;
	max?: number;
	crop?: boolean;
}
