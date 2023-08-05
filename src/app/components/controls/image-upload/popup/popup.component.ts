import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalFunctionService } from '@app/shared/services/global-function.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { ImageCropModel } from '../../utilities/models/image-crop-model';
import { TextBoxModel } from '../../utilities/models/text-box-model';
import { BuilderService } from '../../utilities/services/builder.service';

@Component({
	selector: 'app-popup',
	templateUrl: './popup.component.html',
	styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

	cropper!: ImageCropModel;
	control!: FormControl;
	submitDisable: boolean = true;
	form!: FormGroup;
	caption!: TextBoxModel;
	config: any = { fxFlex: 100 };

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any = {},
		public dialogRef: MatDialogRef<PopupComponent>,
		public locale: LocaleService,
		private controlService: BuilderService,
		private gfService: GlobalFunctionService
	) { }

	ngOnInit(): void {
		if (this.data.action === 'uploadCropper') {
			this.cropper = {
				fieldColumn: 'profilePic',
				fieldCaption: this.locale.translate('profile_picture'),
				additionalMetaData: {
					cropBoxResizable: false,
					dragMode: 'move',
					showBackground: true,
					dragType: 'rectangle',
					zoom: true,
					width: 720,
					height: 480,
					toggleDragModeOnDblclick: false,
					showLabel: false,
					dataUrl: false,
					showUploadIcon: false
				},
				fieldType: 'imageCrop',
				isHidden: false,
				isReadonly: false,
				isRequired: true,
				value: {
					imageSrc: this.data.thumbnail
				},
				fieldPlaceholder: this.locale.translate('profile_picture')
			};
			if (this.data.zoomedValue) {
				this.cropper.value.zoomedValue = this.data.zoomedValue;
			}
			this.controlService.fieldModelBuilder(this.cropper);
			this.control = this.controlService.controlBuilder(this.cropper) as FormControl;
		} else if (['addCaption', 'editCaption'].includes(this.data.action)) {
			this.caption = {
				fieldColumn: 'caption',
				fieldCaption: this.locale.translate('caption'),
				additionalMetaData: {
					maxChar: 100,
					fieldConfig: { appearance: 'standard' },
					showLabel: true,
					patternMatch: ''
				},
				fieldType: 'textBox',
				isHidden: false,
				isReadonly: false,
				isRequired: false,
				type: 'text',
				validationRegex: null,
				value: null,
				fieldPlaceholder: this.locale.translate('caption'),
				fieldOrder: 1
			};
			if (this.data.action === 'editCaption' && this.data.caption) {
				this.caption.value = this.data.caption;
			}
			this.controlService.fieldModelBuilder(this.caption);
			this.control = this.controlService.controlBuilder(this.caption) as FormControl;
			this.submitDisable = false;
		}
	}

	submit() {
		if (navigator.onLine) {
			if (this.data.action === 'uploadCropper') {
				this.updateImage();
			} else if (['addCaption', 'editCaption'].includes(this.data.action)) {
				this.updateCaption();
			}
		}
	}

	updateCaption() {
		if (this.control) {
			this.submitDisable = true;
			if (this.control.valid) {
				this.dialogRef.close({ caption: this.control.value });
			} else {
				this.control.markAsTouched();
				this.submitDisable = false;
			}
		}
	}

	async updateImage() {
		const thumbnail = await this.gfService.fileToDataURL(this.control.value.croppedFile);
		this.control.value.thumbnail = thumbnail;
		this.dialogRef.close(this.control.value);
	}

}
