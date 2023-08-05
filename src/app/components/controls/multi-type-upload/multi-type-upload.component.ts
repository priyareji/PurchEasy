import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BaseService } from '@app/shared/services/base.service';
import { GlobalFunctionService } from '@app/shared/services/global-function.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { FileUploadModel } from '../utilities/models/file-upload-model';
import { ImageUploadModel } from '../utilities/models/image-upload-model';
import { MultiTypeUploadModel } from '../utilities/models/multi-type-upload-model';
import { BuilderService } from '../utilities/services/builder.service';
import { FunctionsService } from '../utilities/services/functions.service';

@Component({
	selector: 'app-multi-type-upload',
	templateUrl: './multi-type-upload.component.html',
	styleUrls: ['./multi-type-upload.component.scss']
})
export class MultiTypeUploadComponent implements OnInit {

	/**
	 * @desc Angular Input Decorator - Common Parameters
	 * @param object field - file upload field data.
	 * @param formControl control - file upload control.
	 */
	@Input() field!: MultiTypeUploadModel;
	@Input() control!: FormControl;
	@Input() progress: number = 0;
	@Output() dropped = new EventEmitter<boolean>();
	@Output() removed = new EventEmitter<boolean>();

	fileFormats = [
		{
			key: 'image',
			formats: ['.jpg', '.jpeg', '.png', '.gif']
		},
		{
			key: 'document',
			formats: ['.pdf', '.txt', '.doc', '.docx', '.xls', '.xlsx']
		},
		{
			key: 'audio',
			formats: ['.mp3']
		},
		{
			key: 'video',
			formats: ['.mp4', '.mpeg']
		}
	];
	helpText: any = {
		size: '',
		type: ''
	};
	selectedFormat: string = '';
	fileField: any;
	form: any;

	fileIcon: any = 'assets/img/dummy-img.png';

	/**
	 * @desc Angular Output Decorator - Common Parameters
	 * @param object helpLineEmit - help line json data.
	 */
	@Output() helpLineEmit = new EventEmitter();
	constructor(
		public locale: LocaleService,
		private controlService: BuilderService,
		public controlFunctions: FunctionsService,
		private baseService: BaseService,
		private gfService: GlobalFunctionService,
	) { }

	ngOnInit() {
		if (this.field.additionalMetaData.fileSize) {
			let size = this.field.additionalMetaData.fileSize.toString().replace(/ /g, '').replace(/[^0-9\.]/g, '').trim();
			if (this.field.additionalMetaData.fileSize.toString().includes('MB')) {
				size += ' MB';
			} else if (this.field.additionalMetaData.fileSize.toString().includes('KB')) {
				size += ' KB';
			} else {
				size += ' GB';
			}
			this.helpText.size = size;
		}
		if (this.field.additionalMetaData.supportedType) {
			if (this.field.additionalMetaData.supportedType !== null) {
				this.helpText.type = this.field.additionalMetaData.supportedType.toString().split('.').join(' ').toUpperCase();
			}
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		if (
			changes.hasOwnProperty('field') &&
			changes.field.currentValue && changes.field.currentValue.value
		) {
			if (typeof changes.field.currentValue.value === 'object') {
				this.fileControlBuild(changes.field.currentValue.value);
			}
		}
		if (
			changes.hasOwnProperty('control') &&
			changes.control.currentValue
		) {
			if (this.field.additionalMetaData.drag && this.field.isRequired && !this.field.value) {
				this.control.setErrors(({ required: true }));
			}

		}
	}

	async fileControlBuild(fileObject: any) {
		if (fileObject.hasOwnProperty('file')) {
			let fileExt;
			let fileName;
			if (typeof fileObject.file === 'object' && fileObject.file instanceof File) {
				fileExt = '.' + fileObject.file.name.substring(fileObject.file.name.lastIndexOf('.') + 1).toLowerCase();
				// fileName = fileObject.file.substring(fileObject.file.lastIndexOf('/') + 1).toLowerCase();
				// fileObject.file = await this.gfService.fileToDataURL(fileObject.file);
			} else {
				fileExt = '.' + fileObject.file.substring(fileObject.file.lastIndexOf('.') + 1).toLowerCase();
				fileName = fileObject.file.substring(fileObject.file.lastIndexOf('/') + 1).toLowerCase();
			}
			for (const fileFormat of this.fileFormats) {
				if (fileFormat.formats.includes(fileExt)) {
					if (fileFormat.key === 'document') {
						fileObject.name = fileName;
					}
					this.fieldBuild(fileObject, fileFormat.key);
					break;
				}
			}
		} else if (Array.isArray(fileObject)) {
			// const fileName = fileObject.thumbnail.substring(fileObject.thumbnail.lastIndexOf('/') + 1).toLowerCase();
			// fileObject.name = fileName;
			this.fieldBuild(fileObject, 'image');
		}
	}


	triggerFile(input: HTMLInputElement) {
		if (navigator.onLine) {
			this.control.markAsTouched();
			if (this.field.isRequired) {
				this.control.setErrors(({ required: true }));
			}
			input.click();
		}
	}

	resetFile(input: HTMLInputElement) {
		this.field.value = null;
		input.value = '';
		this.control.patchValue(null);
		this.form = null;
		this.selectedFormat = '';
	}

	async uploadFile(event: any) {
		if (navigator.onLine) {
			if (this.control.untouched) {
				this.control.markAsTouched();
			}
			if (event.target.files[0]) {
				const file = event.target.files[0];
				const validator = this.control.validator;
				this.control.clearValidators();
				this.control.patchValue(file.name, { emitEvent: false });
				this.control.patchValue(file, { emitModelToViewChange: false, emitEvent: false });
				this.control.setValidators(validator);
				this.control.updateValueAndValidity({ emitEvent: false });
				// this.field.value = file;
				if (this.control.valid) {
					this.control.patchValue(null, { emitEvent: false });
					const fileExt = '.' + file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
					for (const fileFormat of this.fileFormats) {
						if (fileFormat.formats.includes(fileExt)) {
							this.fieldBuild(file, fileFormat.key);
							break;
						}
					}
				}
				// this.fileIcon = await this.gfService.fileToDataURL(file);
				// }
			}
		}
	}

	async fieldBuild(file: any, fileType: string) {
		this.dropped.emit(true);
		let thumbnail;
		if (this.field.value && this.field.value.hasOwnProperty('file') && fileType !== 'image') {
			thumbnail = file.thumbnail;
			// file = file.file;
		}
		if (fileType === 'image') {

			if (!this.field.value) {
				file = [{
					file: file
				}];
			}
			const supportedType: any = this.fileFormats[0].formats;
			const multiFieldType: any = this.field.additionalMetaData.supportedType;
			let imageSupportedTypes = multiFieldType;
			if (Array.isArray(multiFieldType)) {
				imageSupportedTypes = multiFieldType.map(imageType => {
					if (supportedType.includes(imageType)) {
						return imageType;
					}
				});
			}
			const fileField: ImageUploadModel = {
				fieldCaption: this.field.fieldCaption,
				fieldColumn: 'imageUpload',
				validationMessage: this.field.validationMessage,
				fieldOrder: this.field.fieldOrder,
				fieldType: 'imageUpload',
				fieldHelpText: this.field.fieldHelpText,
				fieldPlaceholder: this.field.fieldPlaceholder,
				isRequired: this.field.isRequired,
				isHidden: this.field.isHidden,
				additionalMetaData: {
					showLabel: this.field.additionalMetaData.showLabel,
					fileSize: this.field.additionalMetaData.fileSize,
					supportedType: imageSupportedTypes,
					max: this.field.additionalMetaData.max,
					crop: true
				},
				isReadonly: this.field.isReadonly,
				value: file
			};

			this.fileField = fileField;
		} else if (fileType === 'document') {
			const fileField: FileUploadModel = {
				fieldCaption: this.field.fieldCaption,
				fieldColumn: 'fileUpload',
				validationMessage: this.field.validationMessage,
				fieldOrder: this.field.fieldOrder,
				fieldType: 'fileUpload',
				fieldHelpText: this.field.fieldHelpText,
				fieldPlaceholder: this.field.fieldPlaceholder,
				isRequired: this.field.isRequired,
				isHidden: this.field.isHidden,
				additionalMetaData: {
					showLabel: this.field.additionalMetaData.showLabel,
					fileSize: this.field.additionalMetaData.fileSize,
					supportedType: this.field.additionalMetaData.supportedType,
					drag: this.field.additionalMetaData.drag
				},
				isReadonly: this.field.isReadonly,
				value: file
			};
			if (file) {
				fileField.additionalMetaData.thumbnail = this.baseService.getSnapshot(file.name);
			}
			this.fileField = fileField;
		}
		else if (fileType === 'video') {
			// const uploadVideo: VideoUploadModel = {
			// 	fieldCaption: this.field.fieldCaption,
			// 	fieldColumn: 'uploadVideo',
			// 	fieldOrder: 1,
			// 	fieldType: 'videoUpload',
			// 	validationMessage: this.field.validationMessage,
			// 	fieldHelpText: this.field.fieldHelpText,
			// 	isRequired: this.field.isRequired,
			// 	isHidden: this.field.isHidden,
			// 	additionalMetaData: {
			// 		fileSize: this.field.additionalMetaData.fileSize,
			// 		supportedType: this.field.additionalMetaData.supportedType,
			// 		thumbnailMaxSize: this.field.additionalMetaData.thumbnailMaxSize,
			// 		thumbnailFormat: this.field.additionalMetaData.thumbnailFormat,
			// 		dataUrl: this.field.additionalMetaData.dataUrl
			// 	},
			// 	isReadonly: this.field.isReadonly,
			// 	value: null
			// };
			// if (file instanceof File) {
			// 	uploadVideo.value = {
			// 		videoFile: file
			// 	};
			// 	uploadVideo.value.thumbnail = thumbnail;
			// } else {
			// 	uploadVideo.value = {
			// 		videoFile: file.file,
			// 		thumbnail: file.thumbnail
			// 	};
			// }
			// this.fileField = uploadVideo;
		} else if (fileType === 'audio') {
			// const uploadAudio: AudioUploadModel = {
			// 	fieldCaption: this.field.fieldCaption,
			// 	fieldColumn: 'uploadAudio',
			// 	fieldOrder: 1,
			// 	fieldType: 'audioUpload',
			// 	validationMessage: this.field.validationMessage,
			// 	fieldHelpText: this.field.fieldHelpText,
			// 	isRequired: this.field.isRequired,
			// 	isHidden: this.field.isHidden,
			// 	additionalMetaData: {
			// 		fileSize: this.field.additionalMetaData.fileSize,
			// 		supportedType: this.field.additionalMetaData.supportedType,
			// 		thumbnailMaxSize: this.field.additionalMetaData.thumbnailMaxSize,
			// 		thumbnailFormat: this.field.additionalMetaData.thumbnailFormat,
			// 		dataUrl: this.field.additionalMetaData.dataUrl
			// 	},
			// 	isReadonly: this.field.isReadonly,
			// 	value: null
			// };
			// if (file instanceof File) {
			// 	uploadAudio.value = {
			// 		audioFile: file
			// 	};
			// 	if (thumbnail) {
			// 		uploadAudio.value.thumbnail = thumbnail;
			// 	}
			// } else {
			// 	uploadAudio.value = {
			// 		audioFile: file.file,
			// 		thumbnail: file.thumbnail
			// 	};
			// }

			// this.fileField = uploadAudio
		}
		this.form = this.controlService.formGroupBuilder([this.fileField]);
		this.selectedFormat = fileType;

		if (this.form.controls.fileUpload) {
			this.form.controls.fileUpload.valueChanges.subscribe((data: any) => {
				this.control.patchValue(data, { emitEvent: true })
			});
		}
		if (this.form.controls.uploadVideo) {
			this.form.controls.uploadVideo.valueChanges.subscribe((data: any) => {
				this.control.patchValue(data, { emitEvent: true })
			});
		}
		if (this.form.controls.uploadAudio) {
			this.form.controls.uploadAudio.valueChanges.subscribe((data: any) => {
				this.control.patchValue(data, { emitEvent: true })
			});
		}
		if (this.form.controls.imageUpload) {
			this.form.controls.imageUpload.valueChanges.subscribe((data: any) => {
				this.control.patchValue(data, { emitEvent: true })
			});
		}
	}

	remove(file: any) {
		if (navigator.onLine) {
			this.controlFunctions.resetValue(this.control);
			this.resetFile(file);
			this.removed.emit(true);
		}
	}

	/**
	 * @desc Help line field change method and emit the data.
	 * @param {json} data help line json data.
	 */
	helpLineData(data: any) {
		this.helpLineEmit.emit(data);
	}

}
