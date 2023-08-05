import { Component, EventEmitter, OnInit, Output, Input, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { GlobalFunctionService } from '@app/shared';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dynamic-form-group',
  templateUrl: './dynamic-form-group.component.html',
  styleUrls: ['./dynamic-form-group.component.scss']
})
export class DynamicFormGroupComponent implements OnInit {

  /**
   * @desc Angular Input Decorator - Common Parameters
   * @param array renderFields - array of fields data.
   * @param string type - type of the layout.
   * @param form form - form control of the layout.
   */
  @Input() fieldList: any = [];
  @Input() config: any = {};
  @Input() loader = true;
  @Input() fieldEmitType: 'all' | 'anyOne' | 'trigger' = 'all';
  // form!: FormGroup;

  /**
   * @desc Angular Output Decorator - Common Parameters
   * @param {object} formObject - builded final fields data.
   * @param {object} helpLineEmit - help line json data.
   * @param {object} fieldIconEmit - field icon json data.
   */
  @Output() formObject = new EventEmitter();
  @Output() helpLineEmit = new EventEmitter();
  @Output() fieldIconEmit = new EventEmitter();
  @Output() fieldTrigger: any = new EventEmitter();
  @Output() search: any = new EventEmitter();
  @Output() selectedCategory = new EventEmitter();
  @Output() filterData = new EventEmitter();
  @Output() clear: any = new EventEmitter();
  @Output() removed = new EventEmitter();
  @Output() multiTypeUploadRemoved = new EventEmitter();
  @Output() multiTypeUploadDropped = new EventEmitter();

  formList: any = [];
  formArray: FormArray;

  // fxFlex;
  clearTimeOut: any;
  subscribe: Subscription | null = null;

  constructor(
    public gfService: GlobalFunctionService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('fieldList') && changes.fieldList.currentValue.length) {
      const formFields: any = changes.fieldList.currentValue;
      this.formList = [[...formFields]];
      this.formArray = this.fb.array([]);
    }
  }

  formObjectReader(record: any, formIndex: number) {
    // console.log(record, formIndex)
    this.formArray.push(record.form);
    this.formObject.emit({ form: this.formArray, fields: this.fieldList });

    const form: FormGroup = record.form;
    if (form.controls) {
      const fields = [];
      record.fields.filter((items) => {
        if (!items.isHidden && !items.isReadonly) {
          fields.push(items);
        }
      });
      if (fields.length) {
        let emitChanges: boolean = false;
        fields.filter((field) => {
          if (form.controls[field.fieldColumn]) {
            form.controls[field.fieldColumn].valueChanges.subscribe((controlResp) => {
              if ((this.formList.length - 1) === formIndex) {
                if (![null, '', undefined, []].includes(controlResp)) {
                  if (this.fieldEmitType === 'anyOne') {
                    this.addForm();
                  } else if (this.fieldEmitType === 'all') {
                    // console.log(controlResp)
                    let fieldChangesCount: number = 0;
                    const formValue: any = this.gfService.fieldSubmitApiValueConstruct(
                      form.getRawValue(),
                      this.fieldList
                    );
                    if (Object.keys(formValue).length) {
                      for (const [key, value] of Object.entries(formValue)) {
                        if (![null, '', undefined, []].includes(formValue[key])) {
                          fieldChangesCount += 1;
                        }
                      }
                      if (fieldChangesCount === fields.length) {
                        this.addForm();
                      }
                    }
                  }
                }
              }
            });
          }
        });
      }
    }
  }


  fieldIconData(record: any) {
    this.fieldIconEmit.emit(record);
  }

  helpLineData(record: any) {
    this.helpLineEmit.emit(record);
  }

  multiTypeUploadRemovedEmit(event: any) {
    this.multiTypeUploadRemoved.emit(event);
  }

  multiTypeUploadDroppedEmit(event: any) {
    this.multiTypeUploadDropped.emit(event);
  }

  removeForm(formIndex: number) {
    this.formArray.removeAt(formIndex);
    this.formList.splice(formIndex, 1);
  }

  addForm() {
    this.formList.push([... this.fieldList]);
  }



}
