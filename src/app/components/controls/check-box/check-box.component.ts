import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FunctionsService } from '../utilities/services/functions.service';
import { CheckBoxModel } from '../utilities/models/check-box-model';
import { slide } from '@app/shared/animations/slide.animate';

@Component({
	selector: 'app-check-box',
	templateUrl: './check-box.component.html',
	styleUrls: ['./check-box.component.scss'],
	animations: [slide]
})
export class CheckBoxComponent implements OnInit {

	/**
	 * @desc Angular Input Decorator - Common Parameters
	 * @param object field - check box field data.
	 * @param formGroup control - check box field groups.
	 */
	@Input() field!: CheckBoxModel;
	@Input() control!: FormGroup;

	/**
	 * @desc Angular Output Decorator - Common Parameters
	 * @param object helpLineEmit - help line json data.
	 */
	@Output() helpLineEmit = new EventEmitter();
	constructor(
		public controlFunctions: FunctionsService
	) {
	}

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
