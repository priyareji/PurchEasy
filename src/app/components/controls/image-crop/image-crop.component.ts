import {
	Component,
	OnInit,
	AfterViewInit,
	Input,
	HostListener,
	forwardRef,
	OnChanges,
	ElementRef,
	Renderer2,
	ChangeDetectorRef,
	Output,
	EventEmitter,
	SimpleChanges
} from '@angular/core';
import Cropper from 'cropperjs';
import { FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS } from '@angular/forms';
import { ImageCropModel } from '../utilities/models/image-crop-model';
import { FunctionsService } from '../utilities/services/functions.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { GlobalFunctionService } from '@app/shared/services/global-function.service';
import { AppInitService } from '@app/app-initializer.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { slide } from '@app/shared/animations/slide.animate';

@Component({
	selector: 'app-image-crop',
	templateUrl: './image-crop.component.html',
	styleUrls: ['./image-crop.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => ImageCropComponent),
			multi: true
		},
		{
			provide: NG_VALIDATORS,
			useExisting: forwardRef(() => ImageCropComponent),
			multi: true
		}
	],
	animations: [slide]
})
export class ImageCropComponent implements ControlValueAccessor, OnInit, AfterViewInit, OnChanges {
	/**
	 * @desc Angular Input Decorator - Common Parameters
	 * @param object field - file upload field data.
	 * @param formControl control - file upload control.
	 */
	@Input() field!: ImageCropModel;
	@Input() control!: FormControl;

	@Output() helpLineEmit = new EventEmitter();

	private cropper!: Cropper;
	zoomValue = 0;
	sliderValue = 0;
	mouseZoomValue = 0;
	detectMouseEvent = false;
	imageURL?: string;
	loader = false;
	validateFn!: (file: any) => void;
	ext: string = '';
	initialZoomData: any;
	timeOut: any;
	zoomedValue?: number;

	constructor(
		public controlFunctions: FunctionsService,
		public gfService: GlobalFunctionService,
		private el: ElementRef,
		private renderer2: Renderer2,
		public locale: LocaleService,
		private cdref: ChangeDetectorRef,
		private iconRegistry: MatIconRegistry,
		private sanitizer: DomSanitizer,
		private preLoadService: AppInitService
	) {
		iconRegistry.addSvgIcon('upload_icon', sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/upload-icon.svg'));
	}

	ngOnInit() {
		this.validateFn = validator(this.control.value, this.field);
	}

	validate(c: FormControl) {
		return this.validateFn(c);
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.hasOwnProperty('field') && changes.field.currentValue) {
			this.imageURL = changes.field.currentValue.value.imageSrc;
		}
	}

	ngAfterViewInit() {
		this.initializeCropper();
	}

	initializeCropper() {
		const image = this.el.nativeElement.querySelector('.image-to-crop') as HTMLImageElement;
		const cropperOptions: any = {
			mageSmoothingEnabled: true,
			imageSmoothingQuality: 'high',
			responsive: true,
			minContainerWidth: 100,
			minContainerHeight: 100
		};
		if (this.field.additionalMetaData.hasOwnProperty('viewMode')) {
			cropperOptions.viewMode = this.field.additionalMetaData.viewMode;
		}
		if (this.field.additionalMetaData.hasOwnProperty('restore')) {
			cropperOptions.restore = this.field.additionalMetaData.restore;
		}
		if (this.field.additionalMetaData.hasOwnProperty('strict')) {
			cropperOptions.strict = this.field.additionalMetaData.strict;
		}
		if (this.field.additionalMetaData.hasOwnProperty('center')) {
			cropperOptions.center = this.field.additionalMetaData.center;
		}
		if (this.field.additionalMetaData.hasOwnProperty('highlight')) {
			cropperOptions.highlight = this.field.additionalMetaData.highlight;
		}
		if (this.field.additionalMetaData.hasOwnProperty('guides')) {
			cropperOptions.guides = this.field.additionalMetaData.guides;
		}
		if (this.field.additionalMetaData.hasOwnProperty('autoCropArea')) {
			cropperOptions.autoCropArea = this.field.additionalMetaData.autoCropArea;
		}
		if (this.field.additionalMetaData.hasOwnProperty('dragCrop')) {
			cropperOptions.dragCrop = this.field.additionalMetaData.dragCrop;
		}
		if (this.field.additionalMetaData.hasOwnProperty('cropBoxMovable')) {
			cropperOptions.cropBoxMovable = this.field.additionalMetaData.cropBoxMovable;
		}
		if (this.field.additionalMetaData.hasOwnProperty('showBackground')) {
			cropperOptions.background = this.field.additionalMetaData.showBackground;
		}
		if (this.field.additionalMetaData.hasOwnProperty('movable')) {
			cropperOptions.movable = this.field.additionalMetaData.movable;
		}
		if (this.field.additionalMetaData.hasOwnProperty('zoom')) {
			cropperOptions.zoom = this.field.additionalMetaData.zoom;
		}
		if (this.field.additionalMetaData.hasOwnProperty('zoomOnTounch')) {
			cropperOptions.zoomOnTounch = this.field.additionalMetaData.zoomOnTounch;
		}
		if (this.field.additionalMetaData.hasOwnProperty('zoomOnWheel')) {
			cropperOptions.zoomOnWheel = this.field.additionalMetaData.zoomOnWheel;
		}
		if (this.field.additionalMetaData.hasOwnProperty('cropBoxResizable')) {
			cropperOptions.cropBoxResizable = this.field.additionalMetaData.cropBoxResizable;
		}
		if (this.field.additionalMetaData.hasOwnProperty('dragMode')) {
			cropperOptions.dragMode = this.field.additionalMetaData.dragMode;
		}
		if (this.field.additionalMetaData.hasOwnProperty('toggleDragModeOnDblclick')) {
			cropperOptions.toggleDragModeOnDblclick = this.field.additionalMetaData.toggleDragModeOnDblclick;
		}
		if (this.field.additionalMetaData.hasOwnProperty('dragType')) {
			if (
				!this.field.additionalMetaData.hasOwnProperty('width') &&
				!this.field.additionalMetaData.hasOwnProperty('height')
			) {
				if (this.field.additionalMetaData.dragType === 'round') {
					cropperOptions.aspectRatio = 1;
				} else {
					cropperOptions.aspectRatio = 16 / 9;
				}
			}
		}
		const cropBoxData: any = {};
		const canvasOptions: any = {};
		if (this.field.additionalMetaData) {
			if (this.field.additionalMetaData.hasOwnProperty('left')) {
				cropBoxData.left = this.field.additionalMetaData.left;
			}
			if (this.field.additionalMetaData.hasOwnProperty('top')) {
				cropBoxData.top = this.field.additionalMetaData.top;
			}
			if (this.field.additionalMetaData.hasOwnProperty('width')) {
				cropBoxData.width = this.field.additionalMetaData.width;
				canvasOptions.width = this.field.additionalMetaData.width;
			}
			if (this.field.additionalMetaData.hasOwnProperty('height')) {
				cropBoxData.height = this.field.additionalMetaData.height;
				canvasOptions.height = this.field.additionalMetaData.height;
			}
		}
		this.detectMouseEvent = true;
		this.cropper = new Cropper(
			image,
			this.gfService.JSONMerge(cropperOptions, {
				ready: async () => {
					const containerData = this.cropper.getContainerData();
					const canvasData = this.cropper.getCanvasData();
					const scope = this;
					if ('options' in this.cropper) {
						if ('viewMode' in this.cropper['options'] && 'aspectRatio' in this.cropper['options']) {
							const limited = this.cropper['options']['viewMode'] === 1 || this.cropper['options']['viewMode'] === 2;
							let maxCropBoxWidth = Math.min(
								containerData.width,
								limited ? canvasData.width : containerData.width
							);
							let maxCropBoxHeight = Math.min(
								containerData.height,
								limited ? canvasData.height : containerData.height
							);
							if (this.cropper['options']['aspectRatio']) {
								if (maxCropBoxHeight * this.cropper['options']['aspectRatio'] > maxCropBoxWidth) {
									maxCropBoxHeight = maxCropBoxWidth / this.cropper['options']['aspectRatio'];
								} else {
									maxCropBoxWidth = maxCropBoxHeight * this.cropper['options']['aspectRatio'];
								}
							}
							const actualWidth = cropBoxData.width;
							const actualHeight = cropBoxData.height;
							const maxWidth =
								Math.max(actualWidth, maxCropBoxWidth) < actualWidth
									? Math.max(actualWidth, maxCropBoxWidth)
									: maxCropBoxWidth;
							const maxHeight =
								Math.max(actualHeight, maxCropBoxHeight) < actualHeight
									? Math.max(actualHeight, maxCropBoxHeight)
									: maxCropBoxHeight;
							const minWidth =
								Math.min(actualWidth, maxCropBoxWidth) < actualWidth
									? Math.min(actualWidth, maxCropBoxWidth)
									: maxCropBoxWidth;
							const minHeight =
								Math.min(actualHeight, maxCropBoxHeight) < actualHeight
									? Math.min(actualHeight, maxCropBoxHeight)
									: maxCropBoxHeight;
							if (
								(this.field.additionalMetaData.hasOwnProperty('dragType') &&
									this.field.additionalMetaData.dragType === 'round') ||
								(cropperOptions.hasOwnProperty('aspectRatio') && cropperOptions.aspectRatio === 1) ||
								actualWidth === actualHeight
							) {
								cropBoxData.width = Math.min(maxWidth, maxHeight);
								cropBoxData.height = Math.min(maxWidth, maxHeight);
							} else if (
								this.field.additionalMetaData.hasOwnProperty('width') &&
								this.field.additionalMetaData.hasOwnProperty('height')
							) {
								let crtMinWidth = minWidth;
								let crtMinHeight = minHeight;
								let crtMaxWidth = maxWidth;
								let crtMaxHeight = maxHeight;
								if (actualWidth > actualHeight) {
									crtMinWidth = minHeight / (actualHeight / actualWidth);
									crtMinHeight = minWidth / (actualWidth / actualHeight);
								}
								if (actualWidth < actualHeight) {
									crtMaxWidth = maxHeight / (actualHeight / actualWidth);
									crtMaxHeight = maxWidth / (actualWidth / actualHeight);
								}
								cropBoxData.width = Math.min(crtMinWidth, crtMaxWidth);
								cropBoxData.height = Math.min(crtMinHeight, crtMaxHeight);
							}

							if (
								this.field.additionalMetaData.hasOwnProperty('dragType') &&
								this.field.additionalMetaData.dragType === 'round'
							) {
								const cropperContainer: HTMLDivElement = this.el.nativeElement.querySelector(
									'.cropper-container'
								);
								if (cropperContainer) {
									this.renderer2.addClass(cropperContainer, 'round');
								}
							}
							if (Object.keys(cropBoxData).length > 0) {
								scope.cropper.setCropBoxData(cropBoxData);
							}
							if (this.imageURL) {
								this.setControlValue(canvasOptions);
								const canvas = scope.cropper.getCanvasData();
								this.initialZoomData = canvas.width / canvas.naturalWidth;
								// if (this.field.value && this.field.value.zoomedValue) {
								// 	this.sliderValue = this.field.value.zoomedValue * 100 - this.initialZoomData;
								// 	this.cropper.zoomTo(this.field.value.zoomedValue);
								// }
							}

						}
					}
				},
				zoom: (event: any): boolean | void => {
					if (this.timeOut) {
						clearTimeout(this.timeOut);
					}
					this.timeOut = setTimeout(() => {
						this.setControlValue(canvasOptions);
					}, this.preLoadService.configuration.zoomDelay);
					if (!this.control.touched) {
						this.control.markAsTouched();
					}
					if (this.detectMouseEvent && this.control.valid) {
						const value = Number(event.detail.ratio.toFixed(2)) - Number(this.initialZoomData.toFixed(2));
						if (value === Number(this.initialZoomData.toFixed(2))) {
							this.sliderValue = 0;
							this.zoomValue = 0;
						} else {
							if (event.detail.ratio > event.detail.oldRatio && value >= 1.56) {
								if (value > 1.56 && this.sliderValue >= 150) {
									event.preventDefault();
									event.stopPropagation();
									return false;
								}
								this.sliderValue = 150;
								this.zoomValue = 150 / 100;
							}
							this.sliderValue = Number((value * 100).toFixed(2));
							this.zoomValue = this.sliderValue / 100;

							if (this.sliderValue > 150) {
								this.sliderValue = 150;
								this.zoomValue = 150 / 100;
							} else if (Math.sign(this.sliderValue) === -1) {
								this.sliderValue = 0;
								this.zoomValue = 0;
							}
						}
						// const containerData = this.cropper.getCropBoxData();
						// const centerX = containerData.width / 2;
						// const centerY = containerData.height / 2;
						// console.log(this.cropper.getData(), this.cropper.getImageData(), this.cropper.getCroppedCanvas(), this.cropper.getContainerData());
						// this.zoomedValue = this.sliderValue / 100 + this.initialZoomData;
					}
				},
				crop: async (event: any) => { },
				cropend: async (event: any) => {
					this.setControlValue(canvasOptions);
				}
			})
		);
	}

	async setControlValue(canvasOptions: any) {
		let baseFile;
		let file;
		if (this.field.additionalMetaData.dragType === 'round') {
			baseFile = this.getRoundedCanvas(this.cropper.getCroppedCanvas(canvasOptions)).toDataURL('image/png', 1.0);
			if (this.field.additionalMetaData.dataUrl) {
				file = baseFile;
			} else {
				file = await this.srcToFile(baseFile, `${this.field.fieldColumn}.png`, 'image/png');
			}
		} else {
			baseFile = this.cropper.getCroppedCanvas(canvasOptions).toDataURL('image/' + this.ext, 1.0);
			if (this.field.additionalMetaData.dataUrl) {
				file = baseFile;
			} else {
				file = await this.srcToFile(baseFile, `${this.field.fieldColumn}.${this.ext}`, 'image/' + this.ext);
			}
		}
		let controlValue = this.control.value;
		if ([null, undefined, ''].includes(controlValue)) {
			controlValue = {};
		}
		controlValue.croppedFile = file;
		// if (this.zoomedValue) {
		// 	controlValue.zoomedValue = this.zoomedValue;
		// }
		this.control.patchValue(controlValue);
	}

	@HostListener('mousewheel', ['$event'])
	onMousewheel(event: any) {
		this.detectMouseEvent = true;
	}

	@HostListener('window:resize', ['$event'])
	onResize() {
		this.detectMouseEvent = true;
		this.sliderValue = 0;
		this.zoomValue = 0;
	}

	srcToFile(src: any, fileName: string, mimeType: any) {
		return fetch(src)
			.then((res) => {
				return res.arrayBuffer();
			})
			.then((buf) => {
				return new File([buf], fileName, { type: mimeType });
			});
	}

	zoomInOut(event: any) {
		if (!this.control.touched) {
			this.control.markAsTouched();
		}
		if (this.control.valid) {
			this.detectMouseEvent = false;
			this.sliderValue = event.value;
			const value = event.value / 100 + this.initialZoomData;
			const containerData = this.cropper.getCropBoxData();
			const centerX = containerData.left + containerData.width / 2;
			const centerY = containerData.top + containerData.height / 2;
			if (value === 0) {
				this.cropper.zoomTo(0);
			} else {
				this.zoomedValue = value;
				this.cropper.zoomTo(value, { x: centerX, y: centerY });
			}
			this.zoomValue = value;
			this.detectMouseEvent = true;
		}
	}

	upload(event: any) {
		const target = event.target;
		const fileList: FileList = target.files;
		const file: File = fileList[0];
		if (!this.control.touched) {
			this.control.markAsTouched();
		}
		if (file) {
			this.loader = true;
			const reader = new FileReader();
			reader.readAsDataURL(file);
			const ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
			this.detectMouseEvent = true;
			this.sliderValue = 0;
			this.zoomValue = 0;
			this.field.value.imageSrc = file.name;
			let controlValue = this.control.value;
			if ([null, undefined, ''].includes(controlValue)) {
				controlValue = {};
			}
			if (typeof controlValue === 'object' && controlValue.hasOwnProperty('croppedFile')) {
				delete controlValue.croppedFile;
			}
			controlValue.imageSrc = file.name;
			this.control.patchValue(controlValue);
			this.imageURL = '';
			if (this.cropper) {
				this.cropper.destroy();
			}
			reader.onload = async () => {
				if (['jpg', 'jpeg', 'png'].includes(ext)) {
					const result: any = reader.result;
					this.imageURL = result;
					this.cdref.detectChanges();
					this.initializeCropper();
				}
				this.loader = false;
			};
		}
	}

	delete() {
		this.imageURL = '';
		this.sliderValue = 0;
		this.zoomValue = 0;
		this.detectMouseEvent = false;
		this.control.patchValue(null);
		this.cropper.destroy();
	}

	writeValue(value: null) { }

	registerOnChange(fn: () => void) { }

	registerOnTouched(fn: () => void) { }

	getRoundedCanvas(sourceCanvas: any) {
		const canvas: HTMLCanvasElement = document.createElement('canvas');
		const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
		if (context) {
			const width: number = sourceCanvas.width;
			const height: number = sourceCanvas.height;
			canvas.width = width;
			canvas.height = height;
			context.imageSmoothingEnabled = true;
			context.drawImage(sourceCanvas, 0, 0, width, height);
			context.globalCompositeOperation = 'destination-in';
			context.beginPath();
			context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
			context.fill();
		}
		return canvas;
	}

	/**
 * @desc Help line field change method
 * @param object helpLineEmit - help line json data.
 */
	helpLineData(data: any) {
		this.helpLineEmit.emit(data);
	}
}

export function validator(value: any, field: any) {
	return function validateFileRange(control: FormControl) {
		if (field.isRequired || (!field.isRequired && control.value !== null)) {
			if (control.value === null || [null, undefined, ''].includes(control.value.imageSrc)) {
				this.control.setErrors({ error: { msg: this.locale.translate('image_source_required') } });
				return {
					incorrect: {
						msg: this.locale.translate('image_source_required')
					}
				};
			} else {
				if (control.value.imageSrc.lastIndexOf(';base64,') > 0) {
					const mimeString = control.value.imageSrc.split(',')[0].split(':')[1].split(';')[0];
					this.ext = mimeString.substring(mimeString.lastIndexOf('/') + 1);
				} else {
					this.ext = control.value.imageSrc.substring(control.value.imageSrc.lastIndexOf('.') + 1);
				}
				if (!['jpg', 'jpeg', 'png'].includes(this.ext)) {
					return {
						file: {
							allowedExtension: 'jpg, jpeg, png',
							givenExtension: this.ext,
							message: this.locale.translate('invalid_file_format')
						}
					};
				}
			}
		}
		return null;
	};
}
