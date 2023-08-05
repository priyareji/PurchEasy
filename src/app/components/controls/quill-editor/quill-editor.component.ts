import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FunctionsService } from '../utilities/services/functions.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { slide } from '@app/shared/animations/slide.animate';
import Quill from 'quill';
import ImageResize from 'quill-image-resize-module';
import 'quill-emoji/dist/quill-emoji.js';
import { HandleBarPipe } from '@app/shared/pipes/handle-bar/handle-bar.pipe';
import { QuillEditorModel } from '../utilities/models/quill-editor-model';
Quill.register('modules/imageResize', ImageResize);

const Link = Quill.import('formats/link');
Link.sanitize = function (url) {
	let convertedURL = url.toString();
	if (!convertedURL.match('^(http|https)://')) {
		return `http://${url}`;
	}
	return url;
};

// const FontAttributor = Quill.import('attributors/class/font');
// FontAttributor.whitelist = [
// 	'sofia', 'slabo', 'Roboto', 'inconsolata', 'ubuntu'
// ];
// Quill.register(FontAttributor, true);

@Component({
	selector: 'app-quill-editor',
	templateUrl: './quill-editor.component.html',
	styleUrls: ['./quill-editor.component.scss'],
	animations: [slide]
})
export class QuillEditorComponent implements OnInit {

	@ViewChild('editor') editor: any;

	/**
	 * @desc Angular Input Decorator - Common Parameters
	 * @param object field - text box field data.
	 * @param formControl control - text box control.
	 */
	@Input() field: QuillEditorModel;
	@Input() control: FormControl;

	/**
	 * @desc Angular Output Decorator - Common Parameters
	 * @param object helpLineEmit - help line json data.
	 * @param object fieldIconEmit - field icon json data.
	 */
	@Output() helpLineEmit = new EventEmitter();
	@Output() fieldIconEmit = new EventEmitter();
	validateFn: (file) => void;

	loader = true;

	quileditorConfig: any = {};
	editorialStyle: any = {};
	quillEditorRef;
	editorState = false;
	// fonts = ['impact', 'courier', 'comic'];

	constructor(
		public controlFunctions: FunctionsService,
		public locale: LocaleService,
		private cdref: ChangeDetectorRef
	) {
	}

	ngOnInit() {
	}

	ngOnChanges(change) {
		if (change.hasOwnProperty('field') && change.field.currentValue) {
			const additionalMetaData = JSON.parse(JSON.stringify(change.field.currentValue.additionalMetaData));
			if (additionalMetaData.hasOwnProperty('showLabel')) {
				delete additionalMetaData.showLabel;
			}
			// config.language = 'en';
			// config.allowedContent = true;

			// if (Array.isArray(config.extraPlugins) && config.extraPlugins.length) {
			// 	config.extraPlugins = config.extraPlugins.toString();
			// } else {
			// 	config.extraPlugins = '';
			// }
			// additionalMetaData.config.toolbar.push({
			// 	font: [
			// 		'sofia', 'slabo', 'Roboto', 'inconsolata', 'ubuntu'
			// 	]
			// })
			this.quileditorConfig = additionalMetaData.config;
			this.editorialStyle = additionalMetaData.style;
			this.cdref.detectChanges();
		}
	}

	onReady(editorInstance) {
		this.loader = false;
		this.quillEditorRef = editorInstance;
		const toolbar = editorInstance.getModule('toolbar');
		// toolbar.addHandler('image', this.imageHandler.bind(this));
	}

	imageHandler() {
		const input = document.createElement('input');
		input.setAttribute('type', 'file');
		input.click();

		// Listen upload local image and save to server
		input.onchange = () => {
			const file = input.files[0];

			// file type is only image.
			// if (/^image\//.test(file.type)) {

			// } else {
			// 	console.warn('You could only upload images.');
			// }
			// 	const fileLoader = file.fileLoader;
			let size;
			let ext;
			let error = false;
			const fileExt = '.' + file.name.substring(file.name.lastIndexOf('.') + 1);
			// if (fileLoader.uploadUrl === 'fileUpload') {
			// 	if (this.field.additionalMetaData.fileUploadData) {
			// 		size = this.field.additionalMetaData.fileUploadData.fileSize;
			// 		ext = this.field.additionalMetaData.fileUploadData.supportedType;
			// 		fileLoader.uploadUrl = this.field.additionalMetaData.fileUploadData.url;
			// 	}
			// } else {
			size = this.field.additionalMetaData.imageUploadData.fileSize;
			ext = this.field.additionalMetaData.imageUploadData.supportedType;
			// event.data.fileLoader.uploadUrl = this.field.additionalMetaData.imageUploadData.url;
			// }
			if (ext) {
				if ((typeof ext === 'string' && ext !== fileExt) || (Array.isArray(ext) && ext.length > 0 && !(ext.includes(fileExt)))) {
					this.control.setErrors({
						incorrect: {
							msg: this.locale.translate('invalid_file_format')
						}
					});
					error = true;
				}
			}
			if (size && !error) {
				if (typeof size === 'string' && (size.includes('MB') || size.includes('KB') || size.includes('BYTES'))) {
					const data = Number(size.replace(/ /g, '').replace(/[^0-9\.]/g, '').trim()) || 0;
					if (size.includes('MB')) {
						if (file.size > Number(data * 1e+6)) {
							this.control.setErrors({
								incorrect: {
									msg: this.locale.translate('invalid_file_format')
								}
							});
							error = true;
						}
					} else if (size.includes('KB')) {
						if (file.size > Number(data * 1000)) {
							this.control.setErrors({
								incorrect: {
									msg: this.locale.translate('invalid_file_format')
								}
							});
							error = true;
						}
					} else if (size.includes('GB')) {
						// returnData = sizeValidator(control.value, data * 1e+9);
					} else {
						if (file.size > Number(data)) {
							this.control.setErrors({
								incorrect: {
									msg: this.locale.translate('invalid_file_format')
								}
							});
							error = true;
						}
					}
				}
			}
			if (!error) {
				// 	console.log('valid')
				// const formData = new FormData();
				// const xhr = fileLoader.xhr;

				// xhr.open('POST', fileLoader.uploadUrl, true);
				// xhr.setRequestHeader('Token', JSON.parse(localStorage.getItem('currentUser')).tokenId);
				// formData.append('file', event.data.requestData.upload.file);
				// fileLoader.xhr.send(formData);
				// event.stop();
			} else {

				this.control.markAsTouched();
				// 	event.stop();
				// 	event.data.fileLoader.abort();
			}
		};

	}



	/**
	 * @desc Help line field change method
	 * @param object helpLineEmit - help line json data.
	 */
	helpLineData(data) {
		this.helpLineEmit.emit(data);
	}

	onEditorChange(event) {
		this.control.markAsUntouched();
		if (event && this.editorState && !this.control.touched) {
			this.control.markAsTouched();
		}
	}

	onChange(event) {
		if (!this.editorState) {
			this.control.markAsUntouched();
		}
		this.editorState = true;
		if (event && this.control.value && this.control.value.content && this.field.isRequired) {
			this.control.setErrors(null);
			// const data: string = this.gfService.getPlainText(this.control.value).trim();
			let data = this.control.value.content.replace(/<p>/gi, '').trim();
			data = data.replace(/<\/\p>/gi, '').trim();
			data = data.replace(/\&nbsp;/g, '').trim();
			if (data === '' || this.control.value.content === '') {
				this.control.setErrors({
					incorrect: {
						msg: `${new HandleBarPipe().transform(this.locale.translate('enter_valid'), { caption: this.field.fieldCaption })}`
					}
				});
			} else {
				this.control.setErrors(null);
			}
		} else {
		}
		// this.control.patchValue({
		// 	content: event.html,
		// 	length: event.text.length
		// }, { emitEvent: false })
	}

	onEditorBlur() {
	}

}
