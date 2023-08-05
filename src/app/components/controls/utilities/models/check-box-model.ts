import { SuperModel } from './super-model';

export class CheckBoxModel extends SuperModel {
    options = [];
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
            this.additionalMetaData.max = null;
        }
        if (!field.additionalMetaData.hasOwnProperty('showLabel')) {
            this.additionalMetaData.showLabel = true;
        }
        if (!this.additionalMetaData.hasOwnProperty('changeEventEmit')) {
            this.additionalMetaData.changeEventEmit = true;
        }
        this.options = (field.hasOwnProperty('options')
            && !([null, undefined, ''].includes(field.options))) ? field.options : [];
    }
}

type FieldType = 'checkBox';

interface MetadataBuilder {
    min?: number | null;
    max?: number | null;
    labelPosition?: string;
    showLabel?: boolean;
    changeEventEmit?: boolean;
}
