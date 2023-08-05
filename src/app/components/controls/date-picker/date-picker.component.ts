import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, Injector, Inject } from '@angular/core';
import { FunctionsService } from '../utilities/services/functions.service';
import { CustomDateClasses } from '../utilities/models/super-model';
import { DatePickerModel } from '../utilities/models/date-picker-model';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { Moment } from 'moment';

const moment = _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/

export function Format() {
  const returnData = {
    parse: {
      dateInput: 'MM/DD/YYYY',
    },
    display: {
      dateInput: 'MM/DD/YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
    }
  };
  return returnData;
}

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: Format() },
  ],
})
export class DatePickerComponent implements OnInit {

  /**
   * @desc Angular Input Decorator - Common Parameters
   * @param object field - date field data.
   * @param formControl control - date field control.
   */
  @Input() field!: DatePickerModel;
  @Input() control!: FormControl;

  /**
   * @desc Angular Output Decorator - Common Parameters
   * @param object helpLineEmit - help line json data.
   */
  @Output() helpLineEmit = new EventEmitter();
  format;
  constructor(
    public controlFunctions: FunctionsService,
    public injector: Injector,
    @Inject(MAT_DATE_FORMATS) format: any
  ) {
    this.format = format;
  }

  ngOnInit() {
    if (this.field.additionalMetaData.monthYearPick === true) {
      this.format.parse.dateInput = 'MM/YYYY';
      this.format.display.dateInput = 'MM/YYYY';
    } else {
      this.format.parse.dateInput = 'MM/DD/YYYY';
      this.format.display.dateInput = 'MM/DD/YYYY';
    }
  }

  /**
   * @desc To set necessary validation for date field
   * @param dateEvent datePicker - datePicker event.
   * @param formFieldJson renderField - Input field json data.
   * @param FieldControl control - date field control.
   */
  datePick(datePicker: any, renderField: any, control) {
    if (this.field.additionalMetaData.monthYearPick === true) {
      this.format.parse.dateInput = 'MM/YYYY';
      this.format.display.dateInput = 'MM/YYYY';
    } else {
      this.format.parse.dateInput = 'MM/DD/YYYY';
      this.format.display.dateInput = 'MM/DD/YYYY';
    }
    this.controlFunctions.datePicker = false;
    this.controlFunctions.datePickerIndex = this.controlFunctions.datePickerIndex + 1;
    const body: HTMLElement | null = document.querySelector('body');
    if (body) {
      body.setAttribute('data-date-picker', 'inactive');
      if ([null].includes(datePicker) && [null, undefined, ''].includes(control.value)) {
        if (renderField.isRequired === true) {
          control.setErrors({ required: true });
        }
        control.markAsTouched();
      } else if (!([null].includes(datePicker))) {
        if (control.errors && control.errors.hasOwnProperty('required')) {
          control.setErrors(null);
        }
        this.controlFunctions.datePicker = true;
        body.setAttribute('data-date-picker', 'active');
        if (!datePicker.opened) {
          datePicker.open();
        }
      }
    }
  }

  /**
   * @desc Date color change method
   * @param date dateVal - Date value.
   */
  dateClass = (dateVal: any) => {
    dateVal = dateVal['_d'];
    if (this.field && this.field.hasOwnProperty('additionalMetaData')
      && this.field.additionalMetaData.hasOwnProperty('customDateClasses')
      && Array.isArray(this.field.additionalMetaData.customDateClasses)) {
      const customData: Array<CustomDateClasses> = this.field.additionalMetaData.customDateClasses;
      const date = dateVal.getDate();
      const month = dateVal.getMonth();
      const year = dateVal.getFullYear();
      let className = '';
      customData.map(custom => {
        if (custom.date) {
          if (custom.month && custom.year) {
            if (custom.date === date && (custom.month - 1) === month && custom.year === year) {
              className = 'highlightDate';
            }
          } else if (custom.month) {
            if (custom.date === date && (custom.month - 1) === month) {
              className = 'highlightDate';
            }
          } else if (custom.year) {
            if (custom.date === date && custom.year === year) {
              className = 'highlightDate';
            }
          } else {
            if (custom.date === date) {
              className = 'highlightDate';
            }
          }
        } else {
          className = '';
        }
      });
      return className;
    }
    return null;
  }

  yearHandler(normalizedYear: Moment) {
    // const ctrlValue = this.control.value;
    // ctrlValue.year(normalizedYear.year());
    // this.control.setValue(ctrlValue);
  }

  addEvent(event: any) {
  }

  monthHandler(normalizedMonth: any, datepicker: MatDatepicker<Moment>) {
    // const ctrlValue = this.control.value;
    // ctrlValue.month(normalizedMonth.month());
    if (this.field.additionalMetaData.monthYearPick) {
      this.control.setValue(normalizedMonth['_d']);
      datepicker.close();
    }
  }

  /**
   * @desc Help line field change method
   * @param object helpLineEmit - help line json data.
   */
  helpLineData(data: any) {
    this.helpLineEmit.emit(data);
  }
}
