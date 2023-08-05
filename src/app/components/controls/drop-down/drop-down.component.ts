import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FunctionsService } from '../utilities/services/functions.service';
import { DropDownModel } from '../utilities/models/drop-down-model';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { LocaleService } from '@app/shared/services/locale.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-drop-down',
	templateUrl: './drop-down.component.html',
	styleUrls: ['./drop-down.component.scss']
})
export class DropDownComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild('matSelectAll') matSelectAll!: MatOption;
	@ViewChild('matSelectList') matSelectList!: MatSelect;

	subscribeData: Subscription | null = null;;

	/**
	 * @desc Angular Input Decorator - Common Parameters
	 * @param object field - drop down field data.
	 * @param formControl control - drop down control.
	 */
	@Input() field!: DropDownModel;
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

	ngAfterViewInit() {
		if (this.field.additionalMetaData) {
			if (this.field.additionalMetaData.showSelectAll && this.field.isMultiple) {
				if (this.matSelectAll && this.matSelectAll.onSelectionChange) {
					this.subscribeData = this.matSelectAll.onSelectionChange.subscribe(resp => {
						if (resp.isUserInput) {
							if (resp.source.selected) {
								this.control.patchValue([...this.field.options.map(item => item.key), 'selectAll']);
							} else {
								this.control.patchValue([]);
							}
						}
					});
				}
				if (this.matSelectList && this.matSelectList.optionSelectionChanges) {
					this.subscribeData = this.matSelectList.openedChange.subscribe(resp => {
						if (this.field.additionalMetaData) {
							this.field.additionalMetaData.open = resp;
							if (resp) {
								this.control.disable({ onlySelf: true, emitEvent: false });
							} else {
								this.control.enable();
							}
						}
					});
					this.subscribeData = this.matSelectList.optionSelectionChanges.subscribe((resp): boolean | void => {
						if (resp.source.value !== 'selectAll') {
							if (this.matSelectAll.selected) {
								if (!resp.source.selected && this.control.value.length) {
									this.matSelectAll.deselect();
									return false;
								}
							}
							if (resp.source.selected) {
								if (this.control.value.length === this.field.options.length) {
									// this.control.disable({ onlySelf: true, emitEvent: false });
									if (!this.control.touched) {
										// this.matSelectAll._selectViaInteraction();
									}
									this.matSelectAll.select();
									// this.control.enable({ onlySelf: true, emitEvent: false });
								}
							}
						}
					});
				}
			}
		}
	}

	/**
	 * @desc Help line field change method
	 * @param object helpLineEmit - help line json data.
	 */
	helpLineData(data: any) {
		this.helpLineEmit.emit(data);
	}

	ngOnDestroy() {
		if (this.subscribeData) {
			this.subscribeData.unsubscribe();
		}
	}

}
