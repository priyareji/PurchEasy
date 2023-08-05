import { FormControl } from '@angular/forms';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { AutoCompleteModel } from '@app/components/controls/utilities/models/auto-complete-model';
import { DropDownModel } from '@app/components/controls/utilities/models/drop-down-model';
import { FieldConfig } from '@app/components/controls/utilities/models/super-model';
import { TextBoxModel } from '@app/components/controls/utilities/models/text-box-model';

export interface CookieOptions {
	expire: number;
	path?: string;
	httpOnly?: boolean;
	hostOnly?: boolean;
	secure?: boolean;
	sameSite?: boolean;
	domain?: string;
}
export interface SnackBarConfiguration {
	announcementMessage?: string;
	direction?: string;
	duration?: number;
	horizontalPosition?: MatSnackBarHorizontalPosition;
	panelClass?: string | string[];
	verticalPosition?: MatSnackBarVerticalPosition;
}

export interface MaterialHeader {
	column: string;
	caption: string;
	isSort?: boolean;
	fieldData?: {
		field: TextBoxModel | DropDownModel | AutoCompleteModel;
		fieldConfig?: FieldConfig;
		control?: FormControl;
	};
}

export interface Pagination {
	skip?: number;
	limit?: number;
}


