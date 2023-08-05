import { SuperModel, FieldConfig } from './super-model';

export class InternationalPhNumberModel extends SuperModel {
    additionalMetaData: MetadataBuilder = {};
    isReadonly: boolean = false;
    isHidden: boolean = false;
    fieldType!: FieldType;
    fieldColumn: string = '';
    isRequired: boolean = false;
    constructor(
        field: any
    ) {
        super(field);
        this.isRequired = field.isRequired;
        this.isHidden = field.isHidden;
        this.isReadonly = field.isReadonly;
        this.additionalMetaData = field.additionalMetaData;
        if (!this.additionalMetaData) {
            this.additionalMetaData = {};
        }
        if (!this.additionalMetaData.hasOwnProperty('country')) {
            this.additionalMetaData.country = '';
        }
        if (!this.additionalMetaData.hasOwnProperty('showLabel')) {
            this.additionalMetaData.showLabel = true;
        }
        if (!this.additionalMetaData.hasOwnProperty('changeEventEmit')) {
            this.additionalMetaData.changeEventEmit = true;
        }
    }
}

type FieldType = 'internationalPhoneNumber';

interface MetadataBuilder {
    country?: string;
    showLabel?: boolean;
    fieldConfig?: FieldConfig;
    changeEventEmit?: boolean;
}
