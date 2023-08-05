import { Component, OnInit } from '@angular/core';
import { MaterialHeader, Pagination } from '@app/shared/models/common.model';

@Component({
  selector: 'app-temporary',
  templateUrl: './temporary.component.html',
  styleUrls: ['./temporary.component.scss']
})
export class TemporaryComponent implements OnInit {

  headers: Array<MaterialHeader>;
  recordData: Array<any> = [];
  totalRecordCount = 0;
  paginationData: Pagination = {
    limit: 10,
    skip: 0
  };
  firstPage = true;
  currentUser;
  apiData;
  filterData: any = {};
  filterJson = {
    clearAll: false,
    chipData: []
  };
  loader: boolean = true;

  constructor() { }

  ngOnInit(): void {
    this.headers = [
      {
        column: 'serialNumber',
        caption: 'Serial Number',
      },
      {
        column: 'title',
        caption: 'Name',
      },
      {
        column: 'location',
        caption: 'Location',
      },
      {
        column: 'updatedAt',
        caption: 'Date Modified'
      },
      {
        column: 'createdAt',
        caption: 'Date Created',
        isSort: true
      },
      {
        column: 'action',
        caption: ''
      }
    ];

    this.recordData = [
      {
        "serialNumber": "SKU012384",
        "title": "Title",
        "location": "Chennai",
        "updatedAt": "3-2-1990",
        "createdAt": "3-2-1990",
      },
      {
        "serialNumber": "SKU012384",
        "title": "Title",
        "location": "Chennai",
        "updatedAt": "3-2-1990",
        "createdAt": "3-2-1990",
      },
      {
        "serialNumber": "SKU012384",
        "title": "Title",
        "location": "Chennai",
        "updatedAt": "3-2-1990",
        "createdAt": "3-2-1990",
      },
      {
        "serialNumber": "SKU012384",
        "title": "Title",
        "location": "Chennai",
        "updatedAt": "3-2-1990",
        "createdAt": "3-2-1990",
      },
      {
        "serialNumber": "SKU012384",
        "title": "Title",
        "location": "Chennai",
        "updatedAt": "3-2-1990",
        "createdAt": "3-2-1990",
      },
      {
        "serialNumber": "SKU012384",
        "title": "Title",
        "location": "Chennai",
        "updatedAt": "3-2-1990",
        "createdAt": "3-2-1990",
      },
      {
        "serialNumber": "SKU012384",
        "title": "Title",
        "location": "Chennai",
        "updatedAt": "3-2-1990",
        "createdAt": "3-2-1990",
      },
      {
        "serialNumber": "SKU012384",
        "title": "Title",
        "location": "Chennai",
        "updatedAt": "3-2-1990",
        "createdAt": "3-2-1990",
      },
      {
        "serialNumber": "SKU012384",
        "title": "Title",
        "location": "Chennai",
        "updatedAt": "3-2-1990",
        "createdAt": "3-2-1990",
      },
      {
        "serialNumber": "SKU012384",
        "title": "Title",
        "location": "Chennai",
        "updatedAt": "3-2-1990",
        "createdAt": "3-2-1990",
      },
      {
        "serialNumber": "SKU012384",
        "title": "Title",
        "location": "Chennai",
        "updatedAt": "3-2-1990",
        "createdAt": "3-2-1990",
      },
      {
        "serialNumber": "SKU012384",
        "title": "Title",
        "location": "Chennai",
        "updatedAt": "3-2-1990",
        "createdAt": "3-2-1990",
      },
      {
        "serialNumber": "SKU012384",
        "title": "Title",
        "location": "Chennai",
        "updatedAt": "3-2-1990",
        "createdAt": "3-2-1990",
      },
      {
        "serialNumber": "SKU012384",
        "title": "Title",
        "location": "Chennai",
        "updatedAt": "3-2-1990",
        "createdAt": "3-2-1990",
      },
      {
        "serialNumber": "SKU012384",
        "title": "Title",
        "location": "Chennai",
        "updatedAt": "3-2-1990",
        "createdAt": "3-2-1990",
      },
      {
        "serialNumber": "SKU012384",
        "title": "Title",
        "location": "Chennai",
        "updatedAt": "3-2-1990",
        "createdAt": "3-2-1990",
      },
      {
        "serialNumber": "SKU012384",
        "title": "Title",
        "location": "Chennai",
        "updatedAt": "3-2-1990",
        "createdAt": "3-2-1990",
      },
      {
        "serialNumber": "SKU012384",
        "title": "Title",
        "location": "Chennai",
        "updatedAt": "3-2-1990",
        "createdAt": "3-2-1990",
      },
      {
        "serialNumber": "SKU012384",
        "title": "Title",
        "location": "Chennai",
        "updatedAt": "3-2-1990",
        "createdAt": "3-2-1990",
      },
      {
        "serialNumber": "SKU012384",
        "title": "Title",
        "location": "Chennai",
        "updatedAt": "3-2-1990",
        "createdAt": "3-2-1990",
      },
      {
        "serialNumber": "SKU012384",
        "title": "Title",
        "location": "Chennai",
        "updatedAt": "3-2-1990",
        "createdAt": "3-2-1990",
      },
      {
        "serialNumber": "SKU012384",
        "title": "Title",
        "location": "Chennai",
        "updatedAt": "3-2-1990",
        "createdAt": "3-2-1990",
      },
      {
        "serialNumber": "SKU012384",
        "title": "Title",
        "location": "Chennai",
        "updatedAt": "3-2-1990",
        "createdAt": "3-2-1990",
      },
      {
        "serialNumber": "SKU012384",
        "title": "Title",
        "location": "Chennai",
        "updatedAt": "3-2-1990",
        "createdAt": "3-2-1990",
      },
      {
        "serialNumber": "SKU012384",
        "title": "Title",
        "location": "Chennai",
        "updatedAt": "3-2-1990",
        "createdAt": "3-2-1990",
      }
    ];
    this.totalRecordCount = this.recordData.length;
    this.loader = false;
  }


  clearFilter(event) {
    if (this.paginationData.hasOwnProperty('skip')) {
      delete this.paginationData.skip;
    }
    this.filterData = null;
    this.filterJson.clearAll = false;
  }

  fieldTrigger(event) {
    if (this.paginationData.hasOwnProperty('skip')) {
      delete this.paginationData.skip;
    }
    this.firstPage = true;
    this.filterData = null;
    if (event.hasOwnProperty('fieldData') && event.fieldData.length) {
      let status = false;
      this.filterData = {
        $and: {}
      };
      for (const record of event.fieldData) {
        if (![null, undefined, ''].includes(record.value)) {
          status = true;
        }
        if (record.value) {
          if (['title', 'serialNumber'].includes(record.field.fieldColumn)) {
            this.filterData[record.field.fieldColumn] = {};
            this.filterData[record.field.fieldColumn].$substring = record.value;
          } else if (['locationName'].includes(record.field.fieldColumn)) {
            this.filterData[record.field.fieldColumn] = {};
            this.filterData[record.field.fieldColumn] = record.value;
          }
        }
      }
      this.filterJson.clearAll = status;
      // this.list();
    }
  }

  pagination(event) {
    const paginationData = {
      skip: event.pageEvent.pageIndex,
      limit: event.pageEvent.pageSize
    };
    this.firstPage = false;
    this.paginationData = paginationData;
    // this.list();
  }

  triggerAction(event) {
    if (
      typeof event === 'object' &&
      event &&
      ![null, undefined, ''].includes(event.action) &&
      event.action.type === 'EDIT'
    ) {
      // this.edit(event.record);
    } else if (
      typeof event === 'object' &&
      event &&
      ![null, undefined, ''].includes(event.action) &&
      event.action.type === 'VIEW'
      // this.baseService.checkAccessControl(this.gfService.moduleName$.value, 'DETAIL')
    ) {
      // this.detail(event.record);
    }
  }

}
