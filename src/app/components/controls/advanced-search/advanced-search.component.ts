import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AdvancedSearchModel } from '../utilities/models/advanced-search-model';
import { FunctionsService } from '../utilities/services/functions.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '@app/components/popup/popup.component';
import { DatePipe } from '@angular/common';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { GlobalFunctionService } from '@app/shared/services/global-function.service';

@Component({
	selector: 'app-advanced-search',
	templateUrl: './advanced-search.component.html',
	styleUrls: ['./advanced-search.component.scss']
})
export class AdvancedSearchComponent implements OnInit {

	/**
	 * @desc Angular Input Decorator - Common Parameters
	 * @param object field - file upload field data.
	 * @param formControl control - file upload control.
	 */
	@Input() field: AdvancedSearchModel;
	@Input() control: FormControl;

	/**
	 * @desc Angular Output Decorator - Common Parameters
	 * @param object helpLineEmit - help line json data.
	 */
	@Output() helpLineEmit = new EventEmitter();
	@Output() selectedCategory = new EventEmitter<string>();
	@Output() filterData = new EventEmitter();
	@Output() search = new EventEmitter<boolean>();
	@Output() clear = new EventEmitter<boolean>();

	filterValue = [];
	controlValue = null;
	isSearched = false;

	constructor(
		public controlFunctions: FunctionsService,
		public popup: MatDialog,
		private cdref: ChangeDetectorRef,
		public gfService: GlobalFunctionService
	) { }

	ngOnInit(): void {
		this.controlValue = this.control.value;
		if (this.controlValue) {
			this.isSearched = true;
		}
		if (this.field.additionalMetaData.hasOwnProperty('textBased')) {
			if (this.field.additionalMetaData.textBased) {
				this.control.valueChanges.subscribe((controlResp) => {
					if (!controlResp) {
						this.filterValue = [];
						this.filterData.emit([]);
						this.field.additionalMetaData.filter.forEach((field) => {
							field.value = null;
							if (field.fieldType === 'autoComplete') {
								field.selectedValue = [];
							}
						});
					}
				});
			}
		}
	}


	/**
	 * @desc Display the auto complete value
	 * @param object data - auto complete data.
	 */
	displayAC(data) {
		if (data && typeof data === 'object') {
			return data.value;
		} else {
			return data;
		}
	}

	categorySelect(data, filterColumn: string) {
		if (navigator.onLine) {
			this.field.category.value = data;
			const field = this.field.additionalMetaData.filter.find(items => items.fieldColumn === filterColumn);
			if (field) {
				const findData = this.filterValue.find(items => items.fieldColumn === filterColumn);
				if (findData) {
					findData.value = data.value;
					findData.actualValue = data.key;
				} else {
					this.filterValue.push(
						{
							fieldCaption: field.fieldCaption,
							fieldColumn: field.fieldColumn,
							value: data.value,
							actualValue: data.key,
							hide: true
						}
					);
				}
				field.value = data.key;
				this.filterData.emit(this.filterValue);
			} else {
				this.selectedCategory.next(data);
			}
		}
	}

	clearCategory() {
		if (navigator.onLine) {
			this.field.category.value = null;
			const field = this.field.additionalMetaData.filter.find(items => items.fieldColumn === this.field.category.filterColumn);
			if (field) {
				field.value = null;
				this.filterValue = this.filterValue.filter(items => items.fieldColumn !== field.fieldColumn);
				this.filterData.emit(this.filterValue);
			} else {
				this.filterValue = [];
				this.filterData.emit(this.filterValue);
				this.selectedCategory.next(null);
			}
		}
	}

	filter(actionEl) {
		if (navigator.onLine) {
			const keywords = this.field.additionalMetaData.filter.find(items => items.fieldColumn === 'keywords');
			if (keywords && !([null, undefined].includes(this.control.value))) {
				keywords.value = (typeof this.control.value === 'object') ? this.control.value.value : this.control.value;
			}
			const owlDate = this.field.additionalMetaData.filter.find(items => items.fieldType === 'owlDate');
			if (owlDate) {
				console.log(owlDate);
			}
			const dialogRef = this.popup.open(PopupComponent, {
				panelClass: ['custom-panel'],
				maxWidth: '860px',
				data: {
					fieldList: this.field.additionalMetaData.filter,
					action: 'filter',
					triggerEl: actionEl
				},
				disableClose: true,
				autoFocus: false
			});
			dialogRef.afterClosed().subscribe(async (result) => {
				if (result) {
					const fields = result.fields;
					let owlDateValue = [];
					for (const field of this.field.additionalMetaData.filter) {
						if (this.field.category && this.field.category.filterColumn === field.fieldColumn) {
							const selectedData = this.field.category.data.find(items => items.key === result.formValue[field.fieldColumn]);
							this.field.category.value = selectedData;
						}
						if (field.fieldColumn === 'keywords') {
							this.control.patchValue(result.formValue[field.fieldColumn], { emitEvent: false });
							this.controlValue = result.formValue[field.fieldColumn];
							this.isSearched = true;
						}
						field.value = result.formValue[field.fieldColumn];
						let actualValue = result.formValue[field.fieldColumn];
						let value = result.formValue[field.fieldColumn];
						if (result.formValue[field.fieldColumn]) {
							if (field.fieldType === 'dropDown') {
								value = field.options.find(items => items.key === value).value;
							} else if (field.fieldType === 'owlDate') {
								if (value && value.length > 1) {
									owlDateValue = [...value];
									value[0] = new DatePipe('en-US').transform(value[0], 'MMM d, y');
									value[1] = new DatePipe('en-US').transform(value[1], 'MMM d, y');
									value = value.join(' - ');
								}
							} else if (field.fieldType === 'autoComplete') {
								if (field.selectedValue.length) {
									const selectedValue = [];
									actualValue = [];
									for (const data of field.selectedValue) {
										if (data.isAdd && !data.isDelete) {
											selectedValue.push(data.value);
											actualValue.push(data.key);
										}
									}
									value = selectedValue.toString().replace(/(?:,)/g, ', ');
								}
							}
						}
						const filter = this.filterValue.find(items => items.fieldColumn === field.fieldColumn);
						if (filter) {
							filter.value = value;
							filter.actualValue = actualValue;
						} else {
							const pushJson: any = {
								fieldCaption: field.fieldCaption,
								fieldColumn: field.fieldColumn,
								value,
								actualValue,
								fieldType: field.fieldType
							};
							if ((this.field.category && field.fieldColumn === this.field.category.filterColumn) || field.fieldColumn === 'keywords') {
								pushJson.hide = true;
							}
							this.filterValue.push(pushJson);
						}
						if (field.fieldType === 'owlDate' && field.value) {
							if (field.value.length > 0) {
								field.value = owlDateValue;
							} else {
								field.value = null;
							}
						}
					}
					this.filterData.emit(this.filterValue);
				}
			});
		}
	}

	removeFilter(data) {
		if (navigator.onLine) {
			const field = this.field.additionalMetaData.filter.find(items => items.fieldColumn === data.fieldColumn);
			if (field) {
				field.value = null;
				if (field.fieldType === 'autoComplete') {
					field.selectedValue = [];
				}
			}
			this.filterValue = this.filterValue.filter(items => items.fieldColumn !== data.fieldColumn);
			this.filterData.emit(this.filterValue);
		}
	}

	searching() {
		if (navigator.onLine) {
			if (this.controlValue || this.control.value) {
				this.isSearched = true;
				this.search.emit(true);
			} else if (this.filterValue.find(items => !items.hide && items.value) || (this.field.category && this.field.category.value)) {
				this.isSearched = true;
				this.search.emit(true);
			}
			if (!this.control.value) {
				this.filterValue = [];
				this.filterData.emit(this.filterValue);
			}
			this.controlValue = this.control.value;
		}
	}

	clearSearch() {
		if (navigator.onLine) {
			const keywords = this.field.additionalMetaData.filter.find(items => items.fieldColumn === 'keywords');
			if (keywords) {
				keywords.value = null;
			}
			this.control.patchValue(null);
			this.controlValue = null;
			// this.filterValue = [];
			// this.filterData.emit(this.filterValue);
			if (this.isSearched) {
				this.clear.emit(true);
			}
		}
	}

	selected(event: MatAutocompleteSelectedEvent): void {
		// this.field.selectedValue = [];
		// this.field.selectedValue.push(event.option.value);
		// this.control.patchValue(event.option.value);
	}

	/**
	 * @desc Help line field change method and emit the data.
	 * @param {json} data help line json data.
	 */
	helpLineData(data) {
		this.helpLineEmit.emit(data);
	}

}
