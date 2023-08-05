import { Component, OnInit, Input, Output, EventEmitter, ElementRef, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FunctionsService } from '../utilities/services/functions.service';
import { FileUploadModel } from '../utilities/models/file-upload-model';
import { LocaleService } from '@app/shared/services/locale.service';
import { BaseService } from '@app/shared/services/base.service';
import { GlobalFunctionService } from '@app/shared/services/global-function.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'app-file-upload',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

	/**
	 * @desc Angular Input Decorator - Common Parameters
	 * @param object field - file upload field data.
	 * @param formControl control - file upload control.
	 */
	@Input() field!: FileUploadModel;
	@Input() control!: FormControl;
	@Input() multiType: boolean = false;

	helpText: any = {
		size: '',
		type: ''
	};

	fileIcon: any = 'assets/img/dummy-img.png';

	/**
	 * @desc Angular Output Decorator - Common Parameters
	 * @param object helpLineEmit - help line json data.
	 */
	@Output() helpLineEmit = new EventEmitter();
	constructor(
		private host: ElementRef<HTMLInputElement>,
		public locale: LocaleService,
		public controlFunctions: FunctionsService,
		private baseService: BaseService,
		public gfService: GlobalFunctionService,
		private sanitizer: DomSanitizer
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
			this.helpText.type = this.field.additionalMetaData.supportedType.toString().split('.').join(' ').toUpperCase();
		}
		if (this.field.additionalMetaData.drag && this.field.isRequired && !this.control.value) {
			this.control.setErrors(({ required: true }));
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		if (
			changes.hasOwnProperty('field') &&
			changes.field.currentValue && changes.field.currentValue.value &&
			typeof changes.field.currentValue.value === 'object'
		) {

			if (changes.hasOwnProperty('multiType')) {
				if (changes.multiType.currentValue) {
					this.control.patchValue(changes.field.currentValue.value, { emitEvent: true });
				}
			}

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
		this.fileIcon = null;
		this.field.additionalMetaData.thumbnail = '';
	}

	/**
	 * @desc Help line field change method and emit the data.
	 * @param {json} data help line json data.
	 */
	helpLineData(data: any) {
		this.helpLineEmit.emit(data);
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
				this.control.patchValue(file, { emitModelToViewChange: false });
				this.control.setValidators(validator);
				this.control.updateValueAndValidity();
				this.field.value = file;
				const fileExt = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
				if (['jpg', 'jpeg', 'png'].includes(fileExt)) {
					this.fileIcon = await this.gfService.fileToDataURL(file);
				} else {
					this.fileIcon = this.baseService.getSnapshot(file.name);
				}
			}
		}
	}

}
