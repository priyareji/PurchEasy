import { Directive, HostBinding, HostListener, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Directive({
	selector: '[appDrag]'
})
export class DragDropDirective {
	@Output() files: EventEmitter<object> = new EventEmitter();

	// @HostBinding('style.background') private background = '#eee';

	constructor(private sanitizer: DomSanitizer) { }

	@HostListener('dragover', ['$event'])
	public onDragOver(evt: DragEvent) {
		// console.log('dragging', evt.dataTransfer)
		evt.preventDefault();
		evt.stopPropagation();
		// this.background = '#999';

		// if (evt.dataTransfer.items.length > 1) {
		// this.background = '#eee';
		// }
	}

	@HostListener('dragleave', ['$event'])
	public onDragLeave(evt: DragEvent) {
		evt.preventDefault();
		evt.stopPropagation();
		// this.background = '#eee';
	}

	@HostListener('drop', ['$event'])
	public onDrop(evt: DragEvent) {
		evt.preventDefault();
		evt.stopPropagation();
		// this.background = '#eee';
		// console.log(evt.dataTransfer.files[0])

		// let files: FileHandle[] = [];
		// for (let i = 0; i < evt.dataTransfer.files.length; i++) {
		//   const file = evt.dataTransfer.files[i];
		//   const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
		//   files.push({ file, url });
		// }
		// if (files.length > 0) {
		if (evt.dataTransfer)
			this.files.emit({ target: { files: [evt.dataTransfer.files[0]] } });
		// }
	}
}
