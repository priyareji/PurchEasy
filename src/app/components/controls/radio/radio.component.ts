import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FunctionsService } from '../utilities/services/functions.service';
import { RadioModel } from '../utilities/models/radio-model';
import { slide } from '@app/shared/animations/slide.animate';
import { LocaleService } from '@app/shared/services/locale.service';

@Component({
	selector: 'app-radio',
	templateUrl: './radio.component.html',
	styleUrls: ['./radio.component.scss'],
	animations: [slide]
})
export class RadioComponent implements OnInit {

	/**
	 * @desc Angular Input Decorator - Common Parameters
	 * @param object field - radio field data.
	 * @param formControl control - radio field control.
	 */
	@Input() field!: RadioModel;
	@Input() control!: FormControl;

	/**
	 * @desc Angular Output Decorator - Common Parameters
	 * @param object helpLineEmit - help line json data.
	 */
	@Output() helpLineEmit = new EventEmitter();
	constructor(
		public locale: LocaleService,
		public controlFunctions: FunctionsService
	) { }

	ngOnInit() {
	}

	/**
	 * @desc Help line field change method
	 * @param object helpLineEmit - help line json data.
	 */
	helpLineData(data: any) {
		this.helpLineEmit.emit(data);
	}

}
