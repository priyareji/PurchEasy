import { SuperModel } from './super-model';

export class ImageCropModel extends SuperModel {
	isReadonly: boolean = false;
	isHidden: boolean = false;
	fieldType!: FieldType;
	fieldColumn: string = '';
	isRequired: boolean = false;
	additionalMetaData: MetadataBuilder = {};
	value!: ImageCropValueModel;
	constructor(field: any) {
		super(field);
		this.isRequired = field.isRequired;
		this.isHidden = field.isHidden;
		this.isReadonly = field.isReadonly;
		this.additionalMetaData = field.additionalMetaData;
		if (!this.additionalMetaData) {
			this.additionalMetaData = {};
		}
		if (!this.additionalMetaData.hasOwnProperty('viewMode')) {
			this.additionalMetaData.viewMode = 1;
		}
		if (!this.additionalMetaData.hasOwnProperty('restore')) {
			this.additionalMetaData.restore = true;
		}
		if (!this.additionalMetaData.hasOwnProperty('strict')) {
			this.additionalMetaData.strict = false;
		}
		if (!this.additionalMetaData.hasOwnProperty('center')) {
			this.additionalMetaData.center = true;
		}
		if (!this.additionalMetaData.hasOwnProperty('highlight')) {
			this.additionalMetaData.highlight = false;
		}
		if (!this.additionalMetaData.hasOwnProperty('guides')) {
			this.additionalMetaData.guides = false;
		}
		if (!this.additionalMetaData.hasOwnProperty('autoCropArea')) {
			this.additionalMetaData.autoCropArea = 0.5;
		}
		if (!this.additionalMetaData.hasOwnProperty('dragCrop')) {
			this.additionalMetaData.dragCrop = true;
		}
		if (!this.additionalMetaData.hasOwnProperty('cropBoxMovable')) {
			this.additionalMetaData.cropBoxMovable = true;
		}
		if (!this.additionalMetaData.hasOwnProperty('cropBoxResizable')) {
			this.additionalMetaData.cropBoxResizable = false;
		}
		if (!this.additionalMetaData.hasOwnProperty('showLabel')) {
			this.additionalMetaData.showLabel = true;
		}
		if (!this.additionalMetaData.hasOwnProperty('showBackground')) {
			this.additionalMetaData.showBackground = false;
		}
		if (!this.additionalMetaData.hasOwnProperty('dragMode')) {
			this.additionalMetaData.dragMode = 'crop';
		}
		if (!this.additionalMetaData.hasOwnProperty('zoom')) {
			this.additionalMetaData.zoom = true;
		}
		if (!this.additionalMetaData.hasOwnProperty('dragType')) {
			this.additionalMetaData.dragType = 'rectangle';
		}
		if (!this.additionalMetaData.hasOwnProperty('autoCrop')) {
			this.additionalMetaData.autoCrop = true;
		}
		if (!this.additionalMetaData.hasOwnProperty('dataUrl')) {
			this.additionalMetaData.dataUrl = false;
		}
		if (!this.additionalMetaData.hasOwnProperty('changeEventEmit')) {
			this.additionalMetaData.changeEventEmit = true;
		}
		if (!this.additionalMetaData.hasOwnProperty('showUploadIcon')) {
			this.additionalMetaData.showUploadIcon = true;
		}
	}
}

type FieldType = 'imageCrop';

interface MetadataBuilder {
	viewMode?: number;
	restore?: boolean;
	strict?: boolean;
	center?: boolean;
	highlight?: boolean;
	guides?: boolean;
	autoCropArea?: number;
	dragCrop?: boolean;
	showBackground?: boolean;
	showLabel?: boolean;
	movable?: boolean;
	dragMode?: DragMode;
	zoom?: boolean;
	dragType?: DragType;
	zoomOnTounch?: boolean;
	zoomOnWheel?: boolean;
	cropBoxMovable?: boolean;
	cropBoxResizable?: boolean;
	autoCrop?: boolean;
	left?: number;
	top?: number;
	width?: number;
	height?: number;
	toggleDragModeOnDblclick?: boolean;
	dataUrl?: boolean;
	changeEventEmit?: boolean;
	showUploadIcon?: boolean;
}

interface ImageCropValueModel {
	imageSrc: string;
	zoomedValue?: number;
}

type DragType = 'rectangle' | 'round';

type DragMode = 'crop' | 'move' | 'none';
