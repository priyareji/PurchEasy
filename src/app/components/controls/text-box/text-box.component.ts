import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FunctionsService } from '../utilities/services/functions.service';
import { TextBoxModel } from '../utilities/models/text-box-model';
import { LocaleService } from '@app/shared/services/locale.service';

@Component({
	selector: 'app-text-box',
	templateUrl: './text-box.component.html',
	styleUrls: ['./text-box.component.scss']
})
export class TextBoxComponent implements OnInit {

	progressState: any = {};
	stateMsg: any;
	controlVal: any;
	/**
	 * @desc Angular Input Decorator - Common Parameters
	 * @param object field - text box field data.
	 * @param formControl control - text box control.
	 */
	@Input() field!: TextBoxModel;
	@Input() control!: FormControl;

	/**
	 * @desc Angular Output Decorator - Common Parameters
	 * @param object helpLineEmit - help line json data.
	 * @param object fieldIconEmit - field icon json data.
	 */
	@Output() helpLineEmit = new EventEmitter();
	@Output() fieldIconEmit = new EventEmitter();

	constructor(
		public locale: LocaleService,
		public controlFunctions: FunctionsService
	) { }

	ngOnInit() {
	}

	/**
	 * @desc To remove the white spacescontrolVal
	 * @param InputEvent event - Input event.
	 * @param formFieldJson formField - Input field json data.
	 */
	removeSpace(event: any, formField: any) {
		if (formField !== undefined && !([null, undefined, ''].includes(formField.additionalMetaData))) {
			if (formField.additionalMetaData.hasOwnProperty('type') && formField.additionalMetaData.type === 'number') {
				const replace = /[a-zA-Z+]/gi;
				this.control.patchValue(event.target.value.replace(replace, '').trim());
			} else if (formField.fieldType === 'textBox') {
				const replace = /^\s+|(\s{2,})/gi;
				this.control.patchValue(event.target.value.replace(replace, ''));
			} else {
				const replace = /[a-zA-z&\/\\#,+()$~%.'":*?<>{}@!=|;^-]/gi;
				this.control.patchValue(event.target.value.replace(replace, '').trim());
			}
		}
	}

	onPaste(event: any) {
		if (this.field.additionalMetaData.disablePaste) {
			event.preventDefault();
		}
	}

	fieldChange() {
		if (this.field.type === 'password' && this.field.additionalMetaData.showPasswordStrength) {
			const strData = this.strengthChecker(this.control.value);
			this.progressState = strData.progressState;
			this.stateMsg = strData.stateMsg;
		}
		if (this.field.additionalMetaData.patternMatch) {
			this.patternMatch(this.field.additionalMetaData.patternMatch);
		}
		if (this.field.additionalMetaData.formatter) {
			const formatter = this.field.additionalMetaData.formatter;

			if (this.control.value && formatter[this.control.value.length - 1] && formatter[this.control.value.length - 1] !== 'x') {
				const lastData = this.control.value.substr(this.control.value.length - 1);
				if (lastData !== formatter[this.control.value.length - 1]) {
					const value = this.control.value;
					this.control.setValue(value.slice(0, -1) + formatter[this.control.value.length - 1] + lastData);
				} else if (this.controlVal.length > this.control.value.length) {
					const value = this.control.value;
					this.control.setValue(value.slice(0, -1));
				}
			}
			// const stringFormatter = new StringFormatterPipe();
			// this.control.setValue(stringFormatter.transform(this.control.value, formatter, this.controlVal));

			this.controlVal = this.control.value;
		}
	}

	patternMatch(pattern: string) {
		const patternRegex = new RegExp(pattern);
		let value = this.control.value;
		let status = false;
		for (let i = 0; i < this.control.value.length; i++) {
			const subStr = this.control.value.substr(i, 1);
			if (!patternRegex.test(subStr)) {
				status = true;
				value = value.replace(subStr, '');
			}
		}
		if (status) {
			this.control.patchValue(value);
		}
	}

	/**
	 * @desc Field icon change method
	 * @param object fieldIconEmit - field icon json data.
	 */
	fieldIconData(icon: any) {
		this.fieldIconEmit.emit({ iconData: icon, value: this.control.value });
	}

	/**
	 * @desc Help line field change method
	 * @param object helpLineEmit - help line json data.
	 */
	helpLineData(data: any) {
		this.helpLineEmit.emit(data);
	}

	strengthChecker(value: any) {

		const returnData = {
			progressState: {},
			stateMsg: ''
		};

		if (value.length === 1) {
			returnData.progressState = { width: '10%', background: '#d80000' };
			returnData.stateMsg = this.locale.translate('weak');
		} else if (value.length === 2) {
			returnData.progressState = { width: '20%', background: '#d80000' };
			returnData.stateMsg = this.locale.translate('weak');
		} else if (value.length === 3) {
			returnData.progressState = { width: '30%', background: '#d80000' };
			returnData.stateMsg = this.locale.translate('weak');
		} else if (value.length > 0 && value.length <= 4) {
			returnData.progressState = { width: '35%', background: '#d80000' };
			returnData.stateMsg = this.locale.translate('weak');
		} else if (value.length === 5) {
			returnData.progressState = { width: '45%', background: '#d2d800' };
			returnData.stateMsg = this.locale.translate('low');
		} else if (value.length >= 6) {
			returnData.progressState = { width: '45%', background: '#d2d800' };
			returnData.stateMsg = this.locale.translate('low');
			const mediumRegex = new RegExp('^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*]).{8,}');
			if (mediumRegex.test(value)) {
				returnData.progressState = { width: '80%', background: '#D87D00' };
				returnData.stateMsg = this.locale.translate('average');
				const strongRegex = /^(?=.*(?:.*[0-9]){2,})(?=.*(?:.*[A-Z]){2,})(?=.*(?:.*[a-z]){2,})(?=.*[!@#$%^&*]{2,}).{8,}/g;
				if (strongRegex.test(value)) {
					returnData.progressState = { width: '100%', background: '#2fc557' };
					returnData.stateMsg = this.locale.translate('strong');
				}
			}
		} else {
			returnData.progressState = { width: '0%', background: 'none' };
			returnData.stateMsg = '';
		}

		return returnData;
	}

}
