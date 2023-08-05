import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-help-line',
  templateUrl: './help-line.component.html',
  styleUrls: ['./help-line.component.scss']
})
export class HelpLineComponent implements OnInit {

  /**
   * @desc Angular Input Decorator - Common Parameters
   * @param array helpLineData - Help line render data.
   */
  @Input() helpLineData = [];

  /**
   * @desc Angular Output Decorator - Common Parameters
   * @param object helpLineEmit - help line json data.
   */
  @Output() helpLineEmit = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  /**
   * @desc Help line field change method
   * @param object helpLineEmit - help line json data.
   */
  helpLineChange(data: any) {
    if (data.type === 'link' && [null, undefined, ''].includes(data.method)) {
      if (data.target === '_blank') {
        window.open(data.link, '#');
      } else {
        window.location.href = data.link;
      }
    } else {
      this.helpLineEmit.emit(data);
    }
  }

}
