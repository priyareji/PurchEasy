import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FunctionsService } from '../utilities/services/functions.service';
import { TextAreaModel } from '../utilities/models/text-area-model';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss']
})
export class TextAreaComponent implements OnInit {

  /**
   * @desc Angular Input Decorator - Common Parameters
   * @param object field - text area field data.
   * @param formControl control - text area control.
   */
  @Input() field!: TextAreaModel;
  @Input() control!: FormControl;

  /**
   * @desc Angular Output Decorator - Common Parameters
   * @param object helpLineEmit - help line json data.
   */
  @Output() helpLineEmit = new EventEmitter();

  constructor(
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
