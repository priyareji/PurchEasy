import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {
	transform(value: any, all: any = false): any {
		var reg = all ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
		return !!value
			? value.replace(reg, function (txt: string) {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			})
			: '';
	}
}
