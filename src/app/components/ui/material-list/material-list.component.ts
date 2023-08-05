import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  OnChanges,
  ElementRef,
  AfterViewChecked,
  ChangeDetectorRef
} from '@angular/core';
import { MaterialHeader } from '@app/shared/models/common.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
// import { environment } from '@env/environment';
import { BuilderService } from '@app/components/controls/utilities/services/builder.service';
import { FormControl } from '@angular/forms';
import { GlobalFunctionService } from '@app/shared/services/global-function.service';
import { SelectionModel } from '@angular/cdk/collections';
import { DetectDeviceService } from '@app/shared/services/detect-device.service';
import { AppInitService } from '@app/app-initializer.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.scss']
})
export class MaterialListComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() headers: Array<MaterialHeader>;
  // @Input() displayedColumns: Array<string>;
  @Input() record: Array<any> = [];
  @Input() totalRecordCount = 0;
  @Input() firstPage = true;
  @Input() loader = true;
  @Input() options: any = {};
  @Input() filterJson: any = {};

  @Output() triggerAction = new EventEmitter();
  @Output() triggerSelection = new EventEmitter();
  @Output() pagination = new EventEmitter();
  @Output() fieldTrigger: any = new EventEmitter();
  @Output() filterTrigger: any = new EventEmitter();
  @Input() pageSize = 10;

  @ViewChild(MatPaginator, { static: false })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: false })
  sort: MatSort;

  records: MatTableDataSource<any>;
  columns: Array<string>;
  pageSizeOptions: Array<number>;
  isSort = false;
  isHeaderField = false;
  searchData = [];
  paginationData: PageEvent;
  clearTimeOut;
  filterColumns: Array<string>;
  tableBodyHeight: number = 0;
  selectionArr = new SelectionModel<any>(true, []);
  scrollState;
  browserName: string = '';
  deviceDetails;

  constructor(
    private el: ElementRef,
    private controlBuild: BuilderService,
    public gfService: GlobalFunctionService,
    private cdref: ChangeDetectorRef,
    private detectDevice: DetectDeviceService,
    public locale: LocaleService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private appInit: AppInitService
  ) {
    // this.deviceDetails = detectDevice.fingerPrint;
    this.browserName = detectDevice.fingerPrint.browserName;
    this.pageSizeOptions = appInit.configuration.pageSizeOptions;
  }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    if (changes.hasOwnProperty('record') && changes.record.currentValue) {
      if (changes.record.currentValue) {
        this.records = new MatTableDataSource(changes.record.currentValue);
        this.selectionArr.clear();
        this.recordAlter();
        if (this.isSort) {
          this.sortChange();
        }
      } else {
        this.records = new MatTableDataSource([]);
      }
    }
    if (changes.hasOwnProperty('headers') && changes.headers.currentValue) {
      this.columns = changes.headers.currentValue.map((value) => {
        return value.column;
      });
      if (changes.hasOwnProperty('options') && changes.options.currentValue.hasOwnProperty('selectionData')) {
        this.columns.unshift('select');
        this.headers.unshift({
          column: 'selectionData',
          caption: ''
        });
      }
    }
    if (changes.hasOwnProperty('loader') && changes.loader.currentValue === false) {
      const searchData: any = [];
      for (const header of this.headers) {
        if (header.hasOwnProperty('fieldData') && !header.fieldData.control) {
          this.isHeaderField = true;
          let field: any = header.fieldData.field;
          field = this.controlBuild.fieldModelBuilder(header.fieldData.field);
          header.fieldData.control = (this.controlBuild.controlBuilder(field) as FormControl);
          this.cdref.detectChanges();
          if (field.value) {
            searchData.push({
              value: field.value,
              field: header.fieldData.field
            });
          }
          const control: FormControl = header.fieldData.control;
          let value = control.value;
          control.valueChanges.subscribe((resp) => {
            if (this.clearTimeOut) {
              clearTimeout(this.clearTimeOut);
            }
            if (control.valid) {
              this.clearTimeOut = setTimeout((): boolean | void => {
                if (resp !== null) {
                  if (resp === value) {
                    return false;
                  }
                  const currentField: any = header.fieldData.field;
                  if (
                    currentField.fieldType === 'dropDown' &&
                    currentField.isMultiple &&
                    currentField.additionalMetaData.showSelectAll
                  ) {
                    resp.map((data, index) => {
                      if (data === 'selectAll') {
                        resp.splice(index, 1);
                      }
                    });
                  }
                  const emitField = searchData.find(
                    (items) => items.field.fieldColumn === header.fieldData.field.fieldColumn
                  );
                  if (emitField) {
                    emitField.value = resp;
                  } else {
                    searchData.push({
                      value: resp,
                      field: header.fieldData.field
                    });
                  }
                  const emitJson: any = {
                    fieldData: searchData
                  };
                  if (this.paginationData) {
                    emitJson.pageEvent = this.paginationData;
                  }
                  this.searchData = searchData;
                  value = resp;
                  if (
                    header.fieldData.field.fieldType === 'dropDown' &&
                    emitField === undefined &&
                    resp === undefined
                  ) {
                    emitJson.fieldData = [];
                  }
                  emitJson.currentField = header.fieldData.field.fieldColumn;
                  this.fieldTrigger.emit(emitJson);
                } else {
                  value = null;
                  // this.fieldTrigger.emit({ fieldData: [] });
                }
              }, this.getTimeDelay(header.fieldData.field));
            }
          });
        }
      }
      if (this.isHeaderField && !this.filterColumns) {
        this.filterColumns = this.headers.map((value) => {
          return `${value.column}_filter`;
        });
      }
    }
    if (this.paginator && changes.hasOwnProperty('firstPage') && changes.firstPage.currentValue) {
      this.paginator.pageIndex = 0;
    }
  }

  ngAfterViewChecked() {
    const table = this.el.nativeElement.querySelector('.mat-table tbody');
    if (table && this.tableBodyHeight !== table.offsetHeight) {
      this.tableBodyHeight = table.offsetHeight;
      const scrollerContent = this.el.nativeElement.querySelector('.scroller-content');
      if (scrollerContent) {
        scrollerContent.style.height = `${this.tableBodyHeight > 0
          ? this.tableBodyHeight - 50
          : this.tableBodyHeight}px`;
      }
    }
  }

  getTimeDelay(field): number {
    switch (field.fieldType) {
      case 'textBox':
        return this.appInit.configuration.searchDelay;
      case 'dropDown':
        if (field.isMultiple) {
          return this.appInit.configuration.searchDelay;
        }
        return 0;
      case 'autoComplete':
        return this.appInit.configuration.searchDelay;
      default:
        return null;
    }
  }

  sortChange(event?) {
    this.isSort = true;
    this.records = new MatTableDataSource(this.records.filteredData);
    this.records.sort = this.sort;
  }

  emitPagination(pageEvent: PageEvent) {
    this.selectionArr.clear();
    this.paginationData = pageEvent;
    const paginationData: any = {
      limit: pageEvent.pageSize,
      pageNumber: (pageEvent.pageIndex + 1)
    };
    this.setQueryParams(
      paginationData
    );
    if (this.isHeaderField) {
      this.pagination.emit({ pageEvent: paginationData, fieldData: this.searchData });
    } else {
      this.pagination.emit({ pageEvent: paginationData });
    }
  }

  setQueryParams(queryParams) {
    this.router.navigate([], { relativeTo: this.activatedRouter, queryParamsHandling: 'merge', queryParams });
  }

  emitTriggerAction(action, record) {
    this.triggerAction.emit({ action, record });
  }

  clearFilter() {
    this.selectionArr.clear();
    for (const header of this.headers) {
      if (header.fieldData && header.fieldData.control) {
        header.fieldData.control.patchValue(null);
      }
    }
    this.filterTrigger.emit(true);
  }

  trackByFn(index, item) {
    return index;
  }
  onScrollerScroll(el, state) {
    if (state === 'scroller') {
      const table = this.el.nativeElement.querySelector('.table');
      if (table) {
        table.scrollTop = el.target.scrollTop;
      }
    }
    this.scrollState = 'scroller';
  }
  onTableScroll(el, state) {
    if (state === 'table') {
      const scroller = this.el.nativeElement.querySelector('.scroller');
      if (scroller) {
        scroller.scrollTop = el.target.scrollTop;
      }
    }
    this.scrollState = 'table';
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selectionArr.selected.length;
    // const numRows = this.records.data.length;
    let i = 0;
    for (const record of this.record) {
      if (record.hasOwnProperty('selectionData') && !record.selectionData.disabled) {
        i = i + 1;
      }
    }
    return numSelected === i;
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionArr.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  /** Selects all rows if they are not all selected; otherwise clear selectionArr. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.triggerSelection.emit({ count: 0 });
      this.selectionArr.clear();
      if (this.options.hasOwnProperty('selectionData') && this.options.selectionData.groupBy) {
        for (const record of this.record) {
          if (record.hasOwnProperty('selectionData')) {
            record.selectionData.disabled = false;
          }
        }
      }
    } else {
      let i = 0;
      this.records.data.forEach((row) => {
        if (row.hasOwnProperty('selectionData')) {
          if (!row.selectionData.disabled) {
            i++;
            this.selectionArr.select(row);
          }
        } else {
          this.selectionArr.select(row);
        }
      });
      this.triggerSelection.emit({ count: i });
    }
    this.recordAlter();
  }

  selectionChange(data, event: MatCheckboxChange) {
    if (data.hasOwnProperty('selectionData')) {
      if (data.selectionData.hasOwnProperty('selected')) {
        delete data.selectionData.selected;
      }
      if (event.checked) {
        data.selectionData.selected = true;
      }
    }
    if (this.options.hasOwnProperty('selectionData') && this.options.selectionData.groupBy) {
      if (this.selectionArr.selected.length === 1) {
        for (const record of this.record) {
          if (record[this.options.selectionData.groupBy] && data[this.options.selectionData.groupBy]) {
            if (record[this.options.selectionData.groupBy] !== data[this.options.selectionData.groupBy]) {
              record.selectionData.disabled = true;
            }
          }
        }
      } else if (this.selectionArr.selected.length === 0) {
        for (const record of this.record) {
          record.selectionData.disabled = false;
        }
      }
    }
    this.triggerSelection.emit({ count: this.selectionArr.selected.length });
  }

  recordAlter() {
    for (const record of this.record) {
      if (record.hasOwnProperty('selectionData') && !record.selectionData.disabled) {
        if (record.selectionData.hasOwnProperty('selected')) {
          delete record.selectionData.selected;
        }
        for (const selectData of this.selectionArr.selected) {
          if (selectData.ID === record.ID) {
            record.selectionData.selected = true;
          }
        }
      }
    }
  }
}