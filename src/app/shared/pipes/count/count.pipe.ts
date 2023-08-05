import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
	name: 'count'
})
export class CountPipe implements PipeTransform {

	transform(value: number): string {
		const finalValue = this.precisionRound(value);
		return finalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
	}

	precisionRound(value: number, precision: number = 2) {
		const data = Math.pow(10, precision);
		return Math.round(value * data) / data || 0;
	}

}
