import { SuperModel, FieldConfig } from './super-model';

export class MultiTypeUploadModel extends SuperModel {
	isReadonly: boolean = false;
	isHidden: boolean = false;
	fieldType!: FieldType;
	fieldColumn: string = '';
	isRequired: boolean = false;
	additionalMetaData: MetadataBuilder = {};
	// value?: Value;
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
		if (!this.additionalMetaData.hasOwnProperty('thumbnailWidth')) {
			this.additionalMetaData.thumbnailWidth = 200;
		}
		if (!this.additionalMetaData.hasOwnProperty('thumbnailHeight')) {
			this.additionalMetaData.thumbnailHeight = 100;
		}
		if (!this.additionalMetaData.hasOwnProperty('dataUrl')) {
			this.additionalMetaData.dataUrl = false;
		}
	}
}

type FieldType = 'multiTypeUpload';

interface MetadataBuilder {
	supportedType?: string | Array<string>;
	drag?: boolean;
	fileSize?: number | string;
	showLabel?: boolean;
	fieldConfig?: FieldConfig;
	changeEventEmit?: boolean;
	thumbnail?: string;
	thumbnailMaxSize?: string;
	thumbnailFormat?: string | Array<string>;
	thumbnailWidth?: number;
	thumbnailHeight?: number;
	dataUrl?: boolean;
	max?: number;
}

// interface Value {
// 	audioFile?: string;
// 	thumbnail?: string;
// }
