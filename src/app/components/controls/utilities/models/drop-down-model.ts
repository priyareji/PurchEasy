import { SuperModel, Options, FieldConfig } from './super-model';

export class DropDownModel extends SuperModel {
    options: Array<Options>;
    isMultiple: boolean = false;
    isReadonly: boolean = false;
    isHidden: boolean = false;
    fieldType!: FieldType;
    fieldColumn: string = '';
    isRequired: boolean = false;
    additionalMetaData?: MetadataBuilder = {};
    constructor(
        field: any
    ) {
        super(field);
        this.isRequired = field.isRequired;
        this.isHidden = field.isHidden;
        this.isReadonly = field.isReadonly;
        this.additionalMetaData = field.additionalMetaData;
        this.options = (field.hasOwnProperty('options')
            && Array.isArray(field.options)) ? field.options : [];
        this.isMultiple = (field.hasOwnProperty('isMultiple')
        ) ? field.isMultiple : false;
        if (this.additionalMetaData) {
            if (!this.additionalMetaData.hasOwnProperty('isNone')) {
                this.additionalMetaData.isNone = true;
            }
            if (!this.additionalMetaData.hasOwnProperty('showLabel')) {
                this.additionalMetaData.showLabel = true;
            }
            if (!this.additionalMetaData.hasOwnProperty('showSelectAll')) {
                this.additionalMetaData.showSelectAll = false;
            }
            if (!this.additionalMetaData.hasOwnProperty('changeEventEmit')) {
                this.additionalMetaData.changeEventEmit = true;
            }
        }
    }
}

type FieldType = 'dropDown';

interface MetadataBuilder {
    isNone?: boolean;
    showLabel?: boolean;
    showSelectAll?: boolean;
    open?: boolean;
    fieldConfig?: FieldConfig;
    changeEventEmit?: boolean;
}
