import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
	@Input() formFields: any;
	@Input() config: any = {};
	@Output() formObject = new EventEmitter();

	form!: FormGroup;
	controlJson: any = {};

	constructor() { }

	ngOnInit(): void { }

	formObjectReader(record: any, groupRecord: any, index: number) {
		this.controlJson['group_' + groupRecord.fieldGroupId] = record.form;
		this.form = new FormGroup(this.controlJson);
		if (index === this.formFields.fieldGroup.length - 1) {
			this.formObject.emit({
				field: this.formFields,
				form: this.form
			});
		}
	}
}
