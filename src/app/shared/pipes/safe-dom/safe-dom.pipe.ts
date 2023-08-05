import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
	name: 'safeDom'
})
export class SafeDomPipe implements PipeTransform {
	constructor(private sanitizer: DomSanitizer) { }
	transform(value: any, args?: 'html' | 'url' | 'resourceUrl'): any {
		switch (args) {
			case 'html': return this.sanitizer.bypassSecurityTrustHtml(value);
			case 'url': return this.sanitizer.bypassSecurityTrustUrl(value);
			case 'resourceUrl': return this.sanitizer.bypassSecurityTrustResourceUrl(value);
			default: return this.sanitizer.bypassSecurityTrustHtml(value);
		}
	}

}
