import { SuperModel } from './super-model';

export class QuillEditorModel extends SuperModel {
	isReadonly: boolean;
	isHidden: boolean;
	fieldType: FieldType;
	fieldColumn: string;
	isRequired: boolean;
	additionalMetaData: MetadataBuilder = {};
	validationRegex?: string;
	validationMessage?: string;
	constructor(field) {
		super(field);
		this.isRequired = field.isRequired;
		this.isHidden = field.isHidden;
		this.isReadonly = field.isReadonly;
		this.additionalMetaData = field.additionalMetaData;
		if ([null, undefined].includes(this.additionalMetaData)) {
			this.additionalMetaData = {};
		}
		if (!this.additionalMetaData.hasOwnProperty('style')) {
			// this.additionalMetaData.style = {
			// 	height: '200px'
			// };
		}
		if (!this.additionalMetaData.hasOwnProperty('config')) {
			// if (!this.additionalMetaData.hasOwnProperty('config') || !this.additionalMetaData.config.toolbar.length)
			this.additionalMetaData.config = {
				toolbar: [
					['bold', 'italic', 'underline', 'strike'],        // toggled buttons
					['blockquote', 'code-block'],            // custom button values
					[{ 'list': 'ordered' }, { 'list': 'bullet' }],
					[{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
					[{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
					[{ 'direction': 'rtl' }],                         // text direction
					[{ 'header': [1, 2, 3, 4, 5, 6, false] }],

					[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
					[{ 'font': [] }],
					[{ 'align': [] }],
					['clean'],                                       // remove formatting button
					['link', 'image', 'video', 'formula']                // link and image, video                      // link and image, video
				],
				// toolbar: '#toolbar-container',
				formula: true,
				imageResize: true
			};
		}
	}
}

type FieldType = 'quillEditor';

interface MetadataBuilder {
	showLabel?: boolean;
	title?: string;
	config?: {
		toolbar?: Array<any> | boolean | string;
		formula?: boolean;
		imageResize?: boolean;
		'emoji-toolbar'?: boolean;
		'emoji-textarea'?: boolean;
		'emoji-shortname'?: boolean;
	};
	style?: {
		height?: string;
	};
	imageUploadData?: ImageUploadData;
	changeEventEmit?: boolean;
}

interface ImageUploadData {
	url: string;
	supportedType: Array<string>;
	fileSize: string;
}
