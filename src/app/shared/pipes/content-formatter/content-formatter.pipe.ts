import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'contentFormatter'
})
export class ContentFormatterPipe implements PipeTransform {
	transform(value: string, args?: any): any {

		const urlRegex = /(https?:\/\/[^\s]+)/g;
		return value.replace(urlRegex, function (url) {
			return `<a target='_blank' href=${url}> ${url} </a>`;
		});

	}
}
