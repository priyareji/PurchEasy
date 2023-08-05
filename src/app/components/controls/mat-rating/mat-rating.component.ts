import { Component, OnInit, Input, Output, EventEmitter, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, AbstractControl, FormControl } from '@angular/forms';
// import {Subject} from 'rxjs/Subject';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
import { MatRatingModel } from '../utilities/models/mat-rating-model';
import { FunctionsService } from '../utilities/services/functions.service';
import { slide } from '@app/shared/animations/slide.animate';
import { LocaleService } from '@app/shared/services/locale.service';

@Component({
	selector: 'app-mat-rating',
	templateUrl: './mat-rating.component.html',
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MatRatingComponent), multi: true },
		{ provide: NG_VALIDATORS, useExisting: forwardRef(() => MatRatingComponent), multi: true },
	],
	styleUrls: ['./mat-rating.component.scss'],
	animations: [slide]
})
export class MatRatingComponent implements OnInit, ControlValueAccessor, Validator {

	stateChanges = new Subject<void>();

	@Input() field!: MatRatingModel;
	@Input() control!: FormControl;

	iconClass: string = 'star-icon';

	fullIcon: string = '★';

	emptyIcon: string = '☆';

	readonly: boolean = false;

	get placeholder() { return this._placeholder; }
	set placeholder(plh) {
		this._placeholder = plh;
		this.stateChanges.next();
	}
	private _placeholder!: string;

	get required() { return this._required; }
	set required(req) {
		this._required = coerceBooleanProperty(req);
		this.stateChanges.next();
	}
	private _required: boolean = false;

	get disabled() { return this._disabled; }
	set disabled(dis) {
		this._disabled = coerceBooleanProperty(dis);
		this.stateChanges.next();
	}
	private _disabled: boolean = false;
	float: boolean = false;
	titles: string[] = [];
	set max(max: number) {
		this._max = max;
		this.buildRanges();
	}

	get max() {
		return this._max;
	}

	// -------------------------------------------------------------------------
	// Outputs
	// -------------------------------------------------------------------------

	@Output()
	hover = new EventEmitter();

	@Output()
	leave = new EventEmitter();

	// -------------------------------------------------------------------------
	// Public properties
	// -------------------------------------------------------------------------

	model: number = 0;
	ratingRange: number[] = [];
	hovered: number = 0;
	hoveredPercent: number = 0;

	// -------------------------------------------------------------------------
	// Private Properties
	// -------------------------------------------------------------------------

	private _max: number = 5;
	// private onChange: (m: any) => void;
	private onTouched!: (m: any) => void;
	onChange = (m: any) => { };
	constructor(
		public locale: LocaleService,
		public controlFunctions: FunctionsService
	) {
	}

	// -------------------------------------------------------------------------
	// Implemented from ControlValueAccessor
	// -------------------------------------------------------------------------

	writeValue(value: number): void {
		/*if (value % 1 !== value) {
		 this.model = Math.round(value);
		 return;
		 }*/

		this.model = value;
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	// -------------------------------------------------------------------------
	// Implemented from Va..
	// -------------------------------------------------------------------------

	validate(c: AbstractControl) {
		if (this.required && !c.value) {
			return {
				required: true
			};
		}
		return null;
	}

	// -------------------------------------------------------------------------
	// Lifecycle callbacks
	// -------------------------------------------------------------------------

	ngOnInit() {
		this.placeholder = this.field.fieldPlaceholder || '';
		this.fullIcon = this.field.additionalMetaData.fullIcon || '';
		this.iconClass = this.field.additionalMetaData.iconClass || '';
		this.emptyIcon = this.field.additionalMetaData.emptyIcon || '';
		this.titles = this.field.additionalMetaData.titles || [];
		this.max = this.field.additionalMetaData.max || 5;
		this.float = this.field.additionalMetaData.float || false;
		this.required = this.field.isRequired;
		this.readonly = this.field.isReadonly;
		this.buildRanges();
	}

	// -------------------------------------------------------------------------
	// Host Bindings
	// -------------------------------------------------------------------------

	@HostListener('keydown', ['$event'])
	onKeydown(event: KeyboardEvent): void {
		if ([37, 38, 39, 40].indexOf(event.which) === -1 || this.hovered) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();
		const increment = this.float ? 0.5 : 1;
		this.rate(this.model + (event.which === 38 || event.which === 39 ? increment : increment * -1));
	}

	// -------------------------------------------------------------------------
	// Public Methods
	// -------------------------------------------------------------------------

	calculateWidth(item: number) {
		if (this.hovered > 0) {
			if (this.hoveredPercent && this.hovered === item) {
				return this.hoveredPercent;
			}

			return this.hovered >= item ? 100 : 0;
		}
		return this.model >= item ? 100 : 100 - Math.round((item - this.model) * 10) * 10;
	}

	setHovered(hovered: number): void {
		if (!this.readonly && !this.disabled) {
			this.hovered = hovered;
			this.hover.emit(hovered);
		}
	}

	changeHovered(event: MouseEvent): void {
		if (!this.float) {
			return;
		}
		const target = event.target as HTMLElement;
		const relativeX = event.pageX - target.offsetLeft;
		const percent = Math.round((relativeX * 100 / target.offsetWidth) / 10) * 10;
		this.hoveredPercent = percent > 50 ? 100 : 50;
	}

	resetHovered() {
		this.hovered = 0;
		this.hoveredPercent = 0;
		this.leave.emit(this.hovered);
	}


	rate(value: number) {
		this.control.markAsTouched();
		if (!this.readonly && !this.disabled && value >= 0 && value <= this.ratingRange.length) {
			let newValue = this.hoveredPercent ? (value - 1) + this.hoveredPercent / 100 : value;
			if (newValue === 1 && newValue === this.model && !this.field.isRequired) {
				newValue = 0;
			}
			this.onChange(newValue);
			this.model = newValue;
		}
	}

	// -------------------------------------------------------------------------
	// Private Methods
	// -------------------------------------------------------------------------

	private buildRanges() {
		this.ratingRange = this.range(1, this.max);
	}

	private range(start: number, end: number) {
		const foo: number[] = [];
		for (let i = start; i <= end; i++) {
			foo.push(i);
		}
		return foo;
	}
}
