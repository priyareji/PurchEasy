export interface Features {
	author?: {
		imageSrc: string;
		name: string;
		count?: number;
		createdAt?: string;
		order: number;
	};
	rating?: {
		value: number;
		order: number;
		disabled?: boolean;
		count?: number;
	};
	feature?: {
		order: number;
		data: Array<{
			icon?: string;
			toolTip: string;
			emit: boolean;
			key: string;
			disabled?: boolean;
			classes?: string | Array<string>;
			svgIcon?: string;
		}>;
	};
	assignment?: {
		order: number;
		data: Array<
			{
				type: Type;
				caption: string;
				emit: boolean;
				key: string;
				classes?: string | Array<string>;
			}>
	};
	stats?: {
		type: string;
		imageSrc?: string;
		data: any;
		messageCount?: number;
		sharedCount?: number;
		assignedCount?: number;
		order: number;
		caption?: string;
	};
	manage?: {
		order: number;
		data: Array<{
			icon: string;
			toolTip: string;
			emit: boolean;
			key: string;
		}>
	};
	title?: string;
}

type Type = 'action-button' | 'cancel-button' | 'sub-action-button' | 'sub-cancel-button';

export interface OptionMenu {
	key: string;
	caption: string;
	classes?: string | Array<string>;
	disabled?: boolean;
}
