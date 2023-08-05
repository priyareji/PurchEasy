import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HandleBarPipe } from '@app/shared/pipes/handle-bar/handle-bar.pipe';
import { GlobalFunctionService } from '@app/shared/services/global-function.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { ImageUploadModel } from '../utilities/models/image-upload-model';
import { FunctionsService } from '../utilities/services/functions.service';
import { PopupComponent } from './popup/popup.component';

@Component({
	selector: 'app-image-upload',
	templateUrl: './image-upload.component.html',
	styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit, OnChanges {

	/**
 * @desc Angular Input Decorator - Common Parameters
 * @param object field - file upload field data.
 * @param formControl control - file upload control.
 */
	@Input() field!: ImageUploadModel;
	@Input() control!: FormControl;
	@Input() multiType: boolean = false;

	helpText: any = {
		size: '',
		type: ''
	};
	files: any[] = [];
	reachedMaximum: boolean = false;
	blockUpload: boolean = false;
	inValidFiles: any[] = [];
	filesCount: number = 0;
	showMaxError: boolean = false;

	constructor(
		public gfService: GlobalFunctionService,
		private popup: MatDialog,
		public locale: LocaleService,
		private el: ElementRef,
		private renderer2: Renderer2,
		private handleBarPipe: HandleBarPipe,
		public controlFunctions: FunctionsService,
		private cdref: ChangeDetectorRef
	) { }

	ngOnInit(): void {
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
		if (this.control && this.field.isRequired && !this.control.value) {
			this.control.setErrors(({ required: true }));
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		if (
			changes.hasOwnProperty('field') &&
			changes.field.currentValue && changes.field.currentValue.value &&
			Array.isArray(changes.field.currentValue.value)
		) {
			if (changes.hasOwnProperty('multiType') && changes.multiType) {
				this.manageFile(changes.field.currentValue.value);

			} else {
				for (const data of changes.field.currentValue.value) {
					const fileData: any = {
						removable: true,
						thumbnail: data.file,
						file: data.file,
						actualImageSrc: data.file,
						removed: false
					};
					if (data.caption) {
						fileData.caption = data.caption;
					}

					this.files.push(fileData);
				}

				this.updateControlValue();

				// const fileCount = this.getFilesCount();
				// if (changes.field.currentValue.additionalMetaData.max && changes.field.currentValue.additionalMetaData.max <= fileCount) {
				// 	this.reachedMaximum = true;
				// }
			}
			if (this.control && this.field.isRequired && !this.control.value) {
				this.control.setErrors(({ required: true }));
			}
		}



	}

	async manageFile(files: any[]) {
		// console.log(files);
		for (const data of files) {
			if (data.file instanceof File && !data.cropped && this.field.additionalMetaData.crop) {
				const image = await this.gfService.fileToDataURL(data.file);
				await this.manageCropper(image, data.file);
			} else {
				const fileData: any = {
					removable: true,
					file: data.file,
					removed: false
				};
				if (data.file instanceof File && data.cropped) {
					fileData.thumbnail = data.thumbnailSrc;
					fileData.actualImageSrc = data.thumbnailSrc;
				} else {
					fileData.thumbnail = data.file;
					fileData.actualImageSrc = data.file;
				}
				if (data.caption) {
					fileData.caption = data.caption;
				}
				this.files.push(fileData);

			}
		}
		this.updateControlValue();
	}

	triggerFile(input: HTMLInputElement) {
		if (navigator.onLine) {
			if (!this.reachedMaximum && !this.blockUpload) {
				this.control.markAsTouched();
				const fileCount = this.getFilesCount();
				if (this.field.isRequired && fileCount === 0) {
					this.control.setErrors(({ required: true }));
				}
				input.click();
			}
		}
	}

	getFilesCount() {
		this.filesCount = 0;
		for (const file of this.files) {
			if (!file.removed) {
				this.filesCount += 1;
			}
		}
		return this.filesCount;
	}

	async uploadFile(event: any) {
		if (navigator.onLine) {
			if (!this.reachedMaximum) {
				if (this.control.untouched) {
					this.control.markAsTouched();
				}
				if (event.target.files) {
					// this.manageFile(event.target.files);
					const files = event.target.files;
					const fileCount = this.getFilesCount();
					if ((this.field.additionalMetaData.max && fileCount <= this.field.additionalMetaData.max &&
						files.length <= this.field.additionalMetaData.max && (files.length + fileCount) <= (this.field.additionalMetaData.max)) || !this.field.additionalMetaData.max) {

						this.showMaxError = false;
						if ((files.length + fileCount) === this.field.additionalMetaData.max && this.field.additionalMetaData.max) {
							this.reachedMaximum = true;
						}
						this.control.setErrors(null);

						for (let i = 0; i < files.length; i++) {
							const inValidThumbnail = this.validateThumbnail(files[i]);
							if (!inValidThumbnail) {
								const image = await this.gfService.fileToDataURL(files[i]);
								if (this.field.additionalMetaData.crop) {
									await this.manageCropper(image, files[i]);
								} else {
									const fileData: any = {
										removable: true,
										thumbnail: image,
										file: files[i],
										actualImageSrc: files[i],
										removed: false
									};
									this.files.push(fileData);
								}
							} else {
								this.inValidFiles.push(files[i]);
							}
						}

						const validator = this.control.validator;
						this.control.clearValidators();
						// this.control.patchValue(file.name, { emitEvent: false });
						// this.control.patchValue(file, { emitModelToViewChange: false, emitEvent: false });
						this.control.setValidators(validator);
						this.control.updateValueAndValidity({ emitEvent: false });
						this.field.value = files;
						this.updateControlValue();
						if (this.inValidFiles.length > 0 && !this.control.invalid) {
							this.control.setErrors({ 'invalid': true });
						}
					} else if (this.field.additionalMetaData.max && (files.length + fileCount) > this.field.additionalMetaData.max) {
						this.showMaxError = true;
						if (fileCount === this.field.additionalMetaData.max) {
							this.reachedMaximum = true;
						}
						// this.control.setErrors({
						// 	incorrect: {
						// 		msg: this.handleBarPipe.transform(this.locale.translate('max_file_error'), {
						// 			filesCount: this.field.additionalMetaData.max
						// 		})
						// 	}
						// });
					}

				}
				event.target.value = '';
			}
		}
	}



	async manageCropper(imageFile: any, fileObject: any) {
		return new Promise((resolve, reject) => {
			const canvasElement = this.renderer2.createElement('canvas');
			const ctx = canvasElement.getContext('2d');
			canvasElement.width = 720;
			canvasElement.height = 480;
			ctx.imageSmoothingEnabled = true;

			this.renderer2.setStyle(
				canvasElement,
				'display',
				'none'
			);

			const image = new Image();
			image.src = imageFile;

			function dataURLtoFile(dataurl: any, filename: string) {
				var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
					bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
				while (n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}
				return new File([u8arr], filename, { type: mime });
			}

			function drawImageProp(ctx: any, img: any, x: number, y: number, w: number, h: number, offsetX: number, offsetY: number) {

				if (arguments.length === 2) {
					x = y = 0;
					w = ctx.canvas.width;
					h = ctx.canvas.height;
				}

				// default offset is center
				offsetX = typeof offsetX === "number" ? offsetX : 0.5;
				offsetY = typeof offsetY === "number" ? offsetY : 0.5;

				// keep bounds [0.0, 1.0]
				if (offsetX < 0) offsetX = 0;
				if (offsetY < 0) offsetY = 0;
				if (offsetX > 1) offsetX = 1;
				if (offsetY > 1) offsetY = 1;

				var iw = img.width,
					ih = img.height,
					r = Math.min(w / iw, h / ih),
					nw = iw * r,   // new prop. width
					nh = ih * r,   // new prop. height
					cx, cy, cw, ch, ar = 1;

				// decide which gap to fill
				if (nw < w) ar = w / nw;
				if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
				nw *= ar;
				nh *= ar;

				// calc source rectangle
				cw = iw / (nw / w);
				ch = ih / (nh / h);

				cx = (iw - cw) * offsetX;
				cy = (ih - ch) * offsetY;

				// make sure source rectangle is valid
				if (cx < 0) cx = 0;
				if (cy < 0) cy = 0;
				if (cw > iw) cw = iw;
				if (ch > ih) ch = ih;

				// fill image in dest. rectangle
				ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
			}

			image.onload = () => {
				const offsetX = 0.5;   // center x
				const offsetY = 0.5;   // center y
				drawImageProp(ctx, image, 0, 0, canvasElement.width, canvasElement.height, offsetX, offsetY);
				const croppedThumbnail = canvasElement.toDataURL(fileObject.type, 1.0);
				const fileExt = '.' + fileObject.name.substring(fileObject.name.lastIndexOf('.') + 1).toLowerCase();
				const croppedFile = dataURLtoFile(croppedThumbnail, `profilePic${fileExt}`);
				const fileData: any = {
					removable: true,
					thumbnail: croppedThumbnail,
					file: croppedFile,
					actualImageSrc: imageFile,
					removed: false
				};
				this.files.push(fileData);
				this.renderer2.removeChild(this.el.nativeElement, canvasElement);
				resolve(this.files);
			};

			this.renderer2.appendChild(this.el.nativeElement, canvasElement);
		});

	}

	updateControlValue() {
		let patchValue: any[] | null = this.files.map(data => {
			const fileData: any = {
				file: data.file,
				removed: data.removed
			};
			if (data.caption) {
				fileData.caption = data.caption;
			}
			return fileData;
		});
		if (patchValue && patchValue.length === 0) {
			patchValue = null;
		}
		this.control.patchValue(patchValue);
		this.getFilesCount();
	}

	addCaption(data: any) {
		this.blockUpload = true;
		const dialogRef = this.popup.open(PopupComponent, {
			panelClass: ['custom-panel'],
			data: {
				action: 'addCaption'
			},
			disableClose: true,
			maxWidth: '560px',
			autoFocus: false
		});
		setTimeout(() => {
			this.blockUpload = false;
		});
		dialogRef.afterClosed().subscribe(async (result) => {
			if (result && typeof result === 'object') {
				data.caption = result.caption;
				this.updateControlValue();
			}
		});
	}

	updateCaption(data: any) {
		this.blockUpload = true;
		const dialogRef = this.popup.open(PopupComponent, {
			panelClass: ['custom-panel'],
			data: {
				action: 'editCaption',
				caption: data.caption
			},
			disableClose: true,
			maxWidth: '560px',
			autoFocus: false
		});
		setTimeout(() => {
			this.blockUpload = false;
		});
		dialogRef.afterClosed().subscribe(async (result) => {
			if (result && typeof result === 'object') {
				data.caption = result.caption;
				this.updateControlValue();
			}
		});
	}

	triggerImageCropper(thumbnail: any, action: 'add' | 'update', additionalInfo: any = {}) {
		if (this.field.additionalMetaData.crop && this.files[additionalInfo.index].file instanceof File) {
			if (action === 'update') {
				this.blockUpload = true;
			}
			const data: any = {
				action: 'uploadCropper',
				popup: true,
				thumbnail,
				zoomedValue: additionalInfo.zoomedValue
			};
			if (additionalInfo.index) {
				if (this.files[additionalInfo.index].caption) {
					data.caption = this.files[additionalInfo.index].caption;
				}
			}

			const dialogRef = this.popup.open(PopupComponent, {
				panelClass: ['custom-panel'],
				data,
				disableClose: true,
				maxWidth: '560px',
				autoFocus: false
			});
			if (action === 'update') {
				setTimeout(() => {
					this.blockUpload = false;
				});
			}
			dialogRef.afterClosed().subscribe(async (result) => {
				if (result && typeof result === 'object') {
					if (this.files[additionalInfo.index]) {
						this.files[additionalInfo.index].thumbnail = result.thumbnail;
						this.files[additionalInfo.index].file = result.croppedFile;
					}
					this.updateControlValue();
				}
			});
		} else {
			if (action === 'update') {
				this.blockUpload = true;
				setTimeout(() => {
					this.blockUpload = false;
				});
			}
		}
	}


	removeError() {
		this.blockUpload = true;
		this.inValidFiles = [];
		if (this.files.length) {
			this.control.setErrors(null);
		}
		setTimeout(() => {
			this.blockUpload = false;
			this.reachedMaximum = false;
		});
	}

	removeImage(index: number) {
		if (navigator.onLine) {
			this.blockUpload = true;
			// this.files.splice(index, 1);
			this.files[index].removed = true;
			this.updateControlValue();

			if (!this.control.touched) {
				this.control.markAsTouched();
			}
			this.reachedMaximum = false;
			this.showMaxError = false;
			setTimeout(() => {
				this.blockUpload = false;
			});
			this.getFilesCount();
			if (this.control && this.field.isRequired && this.filesCount === 0) {
				this.control.setErrors(({ required: true }));
			}
		}
	}

	validateThumbnail(thumbnail: any) {
		const sizeValidator = (file: any, sizeVal: any) => {
			if (file.size > Number(sizeVal)) {
				return {
					file: {
						message: this.handleBarPipe.transform(this.locale.translate('file_size'), {
							size: formatBytes(sizeVal)
						}),
						currentFileSize: file.size,
						actualFileSize: sizeVal
					},
					fileSize: true
				};
			}
			return null;
		};

		const formatBytes = (bytes: number) => {
			const si = true;
			const thresh = si ? 1000 : 1024;
			if (Math.abs(bytes) < thresh) {
				return bytes + ' BYTES';
			}
			const units = si
				? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
				: ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
			let u = -1;
			do {
				bytes /= thresh;
				++u;
			} while (Math.abs(bytes) >= thresh && u < units.length - 1);
			return bytes.toFixed(1) + ' ' + units[u];
		};

		let returnData = null;

		const size = this.field.additionalMetaData.fileSize;
		if (size) {
			if (typeof size === 'string' && (size.includes('MB') || size.includes('KB') || size.includes('BYTES'))) {
				const data = Number(size.replace(/ /g, '').replace(/[^0-9\.]/g, '').trim()) || 0;
				if (size.includes('MB')) {
					returnData = sizeValidator(thumbnail, data * 1e6);
				} else if (size.includes('KB')) {
					returnData = sizeValidator(thumbnail, data * 1000);
				} else if (size.includes('GB')) {
					// returnData = sizeValidator(control.value, data * 1e+9);
				} else {
					returnData = sizeValidator(thumbnail, data);
				}
			}
		}

		const thumbFormat = this.field.additionalMetaData.supportedType;
		if (thumbFormat) {
			const fileExt = '.' + thumbnail.type.split('/')[1].toLowerCase();
			if (
				(typeof thumbFormat === 'string' && thumbFormat !== fileExt) ||
				(Array.isArray(thumbFormat) && thumbFormat.length > 0 && !thumbFormat.includes(fileExt))
			) {
				returnData = {
					file: {
						allowedExtension: thumbFormat,
						givenExtension: fileExt,
						message: this.locale.translate('invalid_file_format'),
					},
					fileType: true
				};
			}
		}

		return returnData;
	}

}
