export interface CommonView {
	label: string;
	value?: string | Array<string>;
	icon?: string;
	iconClasses?: string | Array<string>;
	svgIcon?: string;
	chipData?: {
		type: 'standard' | 'classic' | 'prime';
		data: any;
	};
	type: Types;
	thumbnail?: string | File;
}

type Types = 'text' | 'chip' | 'image';
