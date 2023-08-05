import { Component, OnInit, Directive, HostBinding, Input, ContentChildren, QueryList, AfterViewInit, Output, EventEmitter, ChangeDetectorRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { AppInitService } from '@app/app-initializer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalFunctionService } from '@app/shared/services/global-function.service';

@Component({
	selector: 'list-item',
	template: `<ng-content select="content-area"></ng-content>`
})
export class ListItemsComponent {
	@HostBinding('style.min-height') private minHeight = '100%';
	// @HostBinding('style.margin-bottom') private marginBottom = '16px';
}

@Component({
	selector: 'app-common-list',
	templateUrl: './common-list.component.html',
	styleUrls: ['./common-list.component.scss']
})
export class CommonListComponent implements OnInit, AfterViewInit, OnChanges {

	@ContentChildren(ListItemsComponent) listItems!: QueryList<ListItemsComponent>;

	@Input() count = 0;
	@Input() layout: 'row' | 'column' = 'column';
	@Input() layoutGap = '10px';
	@Input() type: 'loadMore' | 'pagination' = 'loadMore';
	@Input() pageSize = 10;
	@Input() pageNumber = 1;
	@Input() showPagination = true;
	@Output() loadMoreData = new EventEmitter<number>();
	@Output() pagination = new EventEmitter<
		{
			limit: number,
			pageNumber: number
		}>();
	@ViewChild('pagination') paginator!: MatPaginator;

	loader = false;
	childLength = 0;
	paginationNumber = 1;
	pageSizeOptions: any[] = [];

	constructor(
		private cdref: ChangeDetectorRef,
		private appInit: AppInitService,
		private router: Router,
		private activatedRouter: ActivatedRoute,
		private gfService: GlobalFunctionService
	) {
	}

	ngOnInit(): void {
		const pageSizeOptions = this.appInit.configuration.pageSizeOptions;
		for (const value of pageSizeOptions) {
			this.pageSizeOptions.push(value);
			if (value > this.count) {
				break;
			}
		}
		if (!this.pageSizeOptions.length) {
			this.pageSizeOptions = [pageSizeOptions[0]];
		}
		if (!this.pageSizeOptions.includes(this.pageSize)) {
			this.pageSize = this.pageSizeOptions[this.pageSizeOptions.length - 1];
		}
	}

	ngAfterViewInit() {
		this.loader = false;
		this.childLength = this.listItems.length;
		this.listItems.changes.subscribe(resp => {
			this.loader = false;
			// this.gfService.blockHttpCall = true;
			this.childLength = this.listItems.length;
		});
		this.cdref.detectChanges();
		if (this.paginator) {
			this.paginator.pageIndex = (this.pageNumber - 1);
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.count && changes.count.currentValue === 0) {
			if (this.paginator) {
				this.paginator.pageIndex = 0;
			} else {
				this.paginationNumber = 1;
			}
		}
		if (changes.pageNumber && changes.pageNumber.currentValue) {
			if (this.paginator) {
				this.paginator.pageIndex = (changes.pageNumber.currentValue - 1);
			}
		}

	}

	loadMore() {
		if (navigator.onLine) {
			this.loader = true;
			this.paginationNumber += 1;
			this.loadMoreData.emit(this.paginationNumber);
		}
	}

	paginationInfo(pageEvent: PageEvent) {
		if (navigator.onLine) {
			this.setQueryParams(
				{
					limit: pageEvent.pageSize,
					pageNumber: pageEvent.pageIndex + 1
				}
			);
			// this.gfService.blockHttpCall = false;
			this.loader = true;
			this.pagination.emit(
				{
					limit: pageEvent.pageSize,
					pageNumber: pageEvent.pageIndex + 1
				}
			);
		}
	}

	setQueryParams(queryParams: any) {
		this.router.navigate([], { relativeTo: this.activatedRouter, queryParamsHandling: 'merge', queryParams });
	}
}

@Directive({
	selector: 'list-item'
})
export class ListItems {
	@HostBinding('style.min-height') private minHeight = '100%';
	// @HostBinding('style.margin-bottom') private marginBottom = '16px';
}
