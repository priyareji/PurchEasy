import { Component, OnInit, Input } from '@angular/core';
import { CommonView } from '../utilities/models/common-view-model';
import { GlobalFunctionService } from '@app/shared/services/global-function.service';

@Component({
	selector: 'app-common-view',
	templateUrl: './common-view.component.html',
	styleUrls: ['./common-view.component.scss']
})
export class CommonViewComponent implements OnInit {
	defaultData = {
		type: 'text',
		label: '',
		value: '',
		thumbnail: ''
	};
	@Input() data: CommonView;

	constructor(private gfService: GlobalFunctionService) { }

	ngOnInit(): void { }

	ngOnChanges(changes) {
		this.data = this.gfService.JSONMerge(this.defaultData, changes.data.currentValue);
	}
}
