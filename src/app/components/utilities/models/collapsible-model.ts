export interface CollapsibleBlockData {
    title?: string;
    desc?: string;
    icon?: string;
    svgIcon?: string;
}

export interface CollapsibleBlockToggle {
    expanded?: boolean;
    expandedIcon?: string;
    closedIcon?: string;
    showToggle?: boolean;
}

export interface CollapsibleBlockAction {
    type: Button;
    caption: string;
    emit: boolean;
    classes?: Array<string> | string;
}

type Button = 'raisedButton';
