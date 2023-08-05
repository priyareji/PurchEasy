import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'handleBar'
})
export class HandleBarPipe implements PipeTransform {

	transform(value: string, args: any): string {
		// For each argument
		Object.keys(args).map((key) => {
			const re = new RegExp('{' + key + '}', 'g');
			value = value.replace(re, args[key]);
		});
		return value;
	}

}
