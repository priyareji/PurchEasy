// export class Alert {
//     type: AlertType;
//     message: string;
//     alertId: string;
//     keepAfterRouteChange: boolean;

//     constructor(init?: Partial<Alert>) {
//         Object.assign(this, init);
//     }
// }

// export enum AlertType {
//     Success,
//     Error,
//     Info,
//     Warning
// }

export interface Alert {
	title?: {
		text: string;
		classes?: string | Array<string>;
	};
	content: {
		text: string;
		classes?: string | Array<string>;
	};
	action?: Array<
		| {
			type: Icon;
			icon?: string;
			svgIcon?: string;
			position: Position;
			emit?: boolean;
			classes?: string | Array<string>;
			toolTip?: string;
		}
		| {
			type: Button;
			caption?: string;
			position: Position;
			emit?: boolean;
			classes?: string | Array<string>;
			toolTip?: string;
		}
		| {
			type: Link;
			caption: string;
			position: Position;
			emit?: boolean;
			classes?: string | Array<string>;
			toolTip?: string;
		}
		| {
			type: Image;
			url: string;
			position: Position;
			emit?: boolean;
			classes?: string | Array<string>;
			toolTip?: string;
		}
	>;
	alertId: string;
	autoHide?: boolean;
	duration?: number;
	type: AlertType;
}

export type AlertType = 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO';

type Position = 'left' | 'right';

type Icon = 'icon' | 'iconButton';

type Button = 'raisedButton' | 'strokedButton' | 'flatButton' | 'fabButton' | 'miniFabButton';

type Link = 'link';

type Image = 'image';
