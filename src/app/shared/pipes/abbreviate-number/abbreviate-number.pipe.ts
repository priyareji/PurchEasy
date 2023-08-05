import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'abbreviateNumber'
})
export class AbbreviateNumberPipe implements PipeTransform {

	transform(value: string | number, args: number = 1): string {
		if (typeof value === 'string') {
			value = Number(value);
		}
		let abbreviateValue: any = value;
		if (value >= 1000000) {
			abbreviateValue = `${(value / 1000000).toFixed(args)}m`;
		} else if (value >= 1000) {
			abbreviateValue = `${(value / 1000).toFixed(args)}k`;
		}
		return abbreviateValue;
	}

}
