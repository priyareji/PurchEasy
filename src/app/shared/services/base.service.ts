import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LocaleService } from './locale.service';

@Injectable({
	providedIn: 'root'
})
export class BaseService {
	database: any = {};
	menuUpdate = new Subject();
	formView: boolean = false;
	constructor(private locale: LocaleService) { }

	referenceType(type: ReferenceType, value: number) {
		return this.getReference(type).find((items) => items.value === value);
	}

	getReference(type: ReferenceType): Array<any> {
		switch (type) {
			case 'customerType':
				return this.customerType;
			case 'activeStatus':
				return this.activeStatus;
			case 'variantActiveStatus':
				return this.variantActiveStatus;
			case 'productActiveStatus':
				return this.productActiveStatus;
			case 'attributeDataType':
				return this.attributeDataType;
			case 'termStatus':
				return this.termStatus;
			default: return [];
		}
	}

	getSnapshot(fileName: string) {
		const fileExt = '.' + fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
		const iconList = [
			{
				name: '.pdf',
				icon: 'assets/img/pdf.png'
			},
			{
				name: '.png',
				icon: 'assets/img/resource-default-image.jpg'
			},
			{
				name: '.jpg',
				icon: 'assets/img/resource-default-image.jpg'
			},
			{
				name: '.jpeg',
				icon: 'assets/img/resource-default-image.jpg'
			},
			{
				name: '.mp4',
				icon: 'assets/img/resource-default-image.jpg'
			},
			{
				name: '.avi',
				icon: 'assets/img/resource-default-image.jpg'
			},
			{
				name: '.mpeg',
				icon: 'assets/img/resource-default-image.jpg'
			},
			{
				name: '.doc',
				icon: 'assets/img/word.png'
			},
			{
				name: '.docx',
				icon: 'assets/img/word.png'
			},
			{
				name: '.txt',
				icon: 'assets/img/pdf.png'
			},
			{
				name: '.csv',
				icon: 'assets/img/pdf.png'
			},
			{
				name: '.xls',
				icon: 'assets/img/excel.png'
			},
			{
				name: '.xlsx',
				icon: 'assets/img/excel.png'
			},
			{
				name: '.ppt',
				icon: 'assets/img/ppt.png'
			},
			{
				name: '.pptx',
				icon: 'assets/img/ppt.png'
			}
		];
		let returnData = 'assets/img/dummy-img.png';
		const findData = iconList.find(items => items.name === fileExt);
		if (findData) {
			returnData = findData.icon;
		}
		return returnData;
	}

	get customerType() {
		return [
			{
				key: 'business',
				caption: this.locale.translate('business'),
				value: 1
			},
			{
				key: 'individual',
				caption: this.locale.translate('individual'),
				value: 2
			}
		];
	}

	get activeStatus() {
		return [
			{
				key: 'activate',
				caption: this.locale.translate('activate'),
				value: 1
			},
			{
				key: 'deactivate',
				caption: this.locale.translate('deactivate'),
				value: 2
			}
		];
	}

	get variantActiveStatus() {
		return [
			{
				key: 'active',
				caption: this.locale.translate('active'),
				value: 1
			},
			{
				key: 'deactive',
				caption: this.locale.translate('deactive'),
				value: 2
			}
		];
	}

	get productActiveStatus() {
		return [
			{
				key: 'active',
				caption: this.locale.translate('active'),
				value: 1
			},
			{
				key: 'deactive',
				caption: this.locale.translate('deactive'),
				value: 2
			}
		];
	}

	get attributeDataType() {
		return [
			{
				key: 'text',
				caption: this.locale.translate('text'),
				value: 1
			},
			{
				key: 'number',
				caption: this.locale.translate('number'),
				value: 2
			},
			{
				key: 'list',
				caption: this.locale.translate('list'),
				value: 3
			},
			{
				key: 'date',
				caption: this.locale.translate('date'),
				value: 4
			}
		];
	}

	get termStatus() {
		return [
			{
				key: 'active',
				caption: this.locale.translate('active'),
				value: 1
			},
			{
				key: 'inactive',
				caption: this.locale.translate('inactive'),
				value: 2
			},
			{
				key: 'moderate',
				caption: this.locale.translate('moderate'),
				value: 2
			}
		];
	}
}

type ReferenceType = 'customerType' | 'activeStatus' | 'variantActiveStatus' | 'productActiveStatus' | 'attributeDataType' | 'termStatus';
