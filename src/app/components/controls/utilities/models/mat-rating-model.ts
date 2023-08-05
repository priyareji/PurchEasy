import { SuperModel } from './super-model';

export class MatRatingModel extends SuperModel {
    isReadonly: boolean = false;
    isHidden: boolean = false;
    fieldType!: FieldType;
    fieldColumn: string = '';
    isRequired: boolean = false;
    additionalMetaData: MetadataBuilder = {};
    constructor(field: any) {
        super(field);
        this.isRequired = field.isRequired;
        this.isHidden = field.isHidden;
        this.isReadonly = field.isReadonly;
        this.additionalMetaData = field.additionalMetaData;
        if (!this.additionalMetaData) {
            this.additionalMetaData = {};
        }
        if (!this.additionalMetaData.hasOwnProperty('min')) {
            this.additionalMetaData.min = null;
        }
        if (!this.additionalMetaData.hasOwnProperty('max')) {
            this.additionalMetaData.max = 5;
        }
        if (!this.additionalMetaData.hasOwnProperty('iconClass')) {
            this.additionalMetaData.iconClass = 'star-icon';
        }
        if (!this.additionalMetaData.hasOwnProperty('fullIcon')) {
            this.additionalMetaData.fullIcon = '★';
        }
        if (!this.additionalMetaData.hasOwnProperty('emptyIcon')) {
            this.additionalMetaData.emptyIcon = '☆';
        }
        if (!this.additionalMetaData.hasOwnProperty('float')) {
            this.additionalMetaData.float = false;
        }
        if (!this.additionalMetaData.hasOwnProperty('showRatingCaption')) {
            this.additionalMetaData.showRatingCaption = true;
        }
        if (!this.additionalMetaData.hasOwnProperty('showRatingTitle')) {
            this.additionalMetaData.showRatingTitle = true;
        }
        if (!this.additionalMetaData.hasOwnProperty('changeEventEmit')) {
            this.additionalMetaData.changeEventEmit = true;
        }
    }
}

type FieldType = 'rating';

interface MetadataBuilder {
    min?: number | null;
    max?: number;
    iconClass?: string;
    fullIcon?: string;
    emptyIcon?: string;
    float?: boolean;
    titles?: string[];
    showRatingCaption?: boolean;
    showRatingTitle?: boolean;
    changeEventEmit?: boolean;
}
