import { ValidatorFn, FormControl } from '@angular/forms';

export function File(
	ext: Array<string>, size: number | string = 0, minWidth: number | null = null, maxWidth: number | null = null, minHeight: number | null = null,
	maxHeight: number | null = null): ValidatorFn | any {

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

	const sizeValidator = (file: any, sizeVal: number) => {
		if (file.size > Number(sizeVal)) {
			// this.fileTypeError[formField.fieldColumn] = true;
			return {
				fileUploadSize: {
					msg: 'File should be less than ' + formatBytes(sizeVal),
					currentFileSize: file.size,
					actualFileSize: sizeVal
				}
			};
		}
		return null;
	};

	const dimensionValidator = (file: File, minWidthVal: number | string, maxWidthVal: number | string, minHeightVal: number | string, maxHeightVal: number | string) => {
		const fileReader = new FileReader();
		const fileExt = file.name.split('.')[1].toLowerCase();
		if (['jpg', 'jpeg', 'png'].includes(fileExt)) {
			fileReader.readAsDataURL(file); // read file as data url
			fileReader.onload = (fileReaderEvent: any) => { // called once readAsDataURL is completed
				let wd = 0;
				let ht = 0;
				const img: any = new Image();
				img.onload = () => {
					wd = img.width;
					ht = img.height;
					if (minWidthVal && wd < Number(minWidthVal)) {
						this.control.setErrors({
							imageMinWidth: {
								message: `Min width of the image must be ${minWidthVal}px`,
								currentFileSize: wd,
								actualFileSize: minWidthVal
							}
						});
					} else if (maxWidthVal && wd > Number(maxWidthVal)) {
						this.control.setErrors({
							imageMaxWidth: {
								msg: `Max width of the image must be ${maxWidthVal}px`,
								currentFileSize: wd,
								actualFileSize: maxWidthVal
							}
						});
					} else if (minHeightVal && wd < Number(minHeightVal)) {
						this.control.setErrors({
							imageMinHeight: {
								msg: `Min heigth of the image must be ${minHeightVal}px`,
								currentFileSize: ht,
								actualFileSize: minHeightVal
							}
						});
					} else if (maxHeightVal && wd > Number(maxHeightVal)) {
						this.control.setErrors({
							imageMaxHeight: {
								msg: `Max height of the image must be ${maxHeightVal}px`,
								currentFileSize: ht,
								actualFileSize: maxHeightVal
							}
						});
					}
				};
			};
		}
	};

	const validator = (control: FormControl): { [key: string]: any } | null => {
		let returnData = null;
		if (![null, 'null', undefined].includes(control.value)) {
			if (typeof control.value === 'object' && control.value.name) {
				if (size) {
					if (typeof size === 'string' && (size.includes('MB') || size.includes('KB') || size.includes('BYTES'))) {
						const data = Number(size.replace(/ /g, '').replace(/[^0-9\.]/g, '').trim()) || 0;
						if (size.includes('MB')) {
							returnData = sizeValidator(control.value, data * 1e+6);
						} else if (size.includes('KB')) {
							returnData = sizeValidator(control.value, data * 1000);
						} else if (size.includes('GB')) {
							// returnData = sizeValidator(control.value, data * 1e+9);
						} else {
							returnData = sizeValidator(control.value, data);
						}
					}
				}
				const nameSplit = control.value.name.split('.');
				const fileExt = '.' + control.value.name.substring(control.value.name.lastIndexOf('.') + 1).toLowerCase();
				if ((typeof ext === 'string' && ext !== fileExt) || (Array.isArray(ext) && ext.length > 0 && !(ext[0].includes(fileExt)))) {
					returnData = {
						file: {
							allowedExtension: ext,
							givenExtension: fileExt,
							message: `Invalid file format.`
						}
					};
				}
			} else if (typeof control.value === 'string') {
				const fileExt = '.' + control.value.substring(control.value.lastIndexOf('.') + 1).toLowerCase();
				if ((typeof ext === 'string' && ext !== fileExt) || (Array.isArray(ext) && ext.length > 0 && !(ext.includes(fileExt)))) {
					returnData = {
						file: {
							allowedExtension: ext,
							givenExtension: fileExt,
							message: `Invalid file format.`
						}
					};
				}
			}
			// if (!returnData) {
			//   this.sizeValidator(control.value, size);
			// }

			// if (!returnData) {
			//   this.dimensionValidator(control.value, minWidth, maxWidth, minHeight, maxHeight);
			// }
		}
		return returnData;
	};
	return validator;
}
