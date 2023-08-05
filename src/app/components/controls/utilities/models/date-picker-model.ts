import { SuperModel, CustomDateClasses, FieldConfig } from './super-model';

export class DatePickerModel extends SuperModel {
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
        if (!this.additionalMetaData.hasOwnProperty('customDateClasses')) {
            const customDate: Array<CustomDateClasses> = [];
            this.additionalMetaData.customDateClasses = customDate;
        }
        if (!this.additionalMetaData.hasOwnProperty('startAt')) {
            this.additionalMetaData.startAt = null;
        }
        if (!this.additionalMetaData.hasOwnProperty('startView')) {
            this.additionalMetaData.startView = null;
        }
        if (!this.additionalMetaData.hasOwnProperty('touchUi')) {
            this.additionalMetaData.touchUi = null;
        }
        if (!this.additionalMetaData.hasOwnProperty('minDate')) {
            this.additionalMetaData.minDate = null;
        }
        if (!this.additionalMetaData.hasOwnProperty('maxDate')) {
            this.additionalMetaData.maxDate = null;
        }
        if (!this.additionalMetaData.hasOwnProperty('showLabel')) {
            this.additionalMetaData.showLabel = true;
        }
        if (!field.additionalMetaData.hasOwnProperty('monthYearPick')) {
            this.additionalMetaData.monthYearPick = false;
        } else if (field.additionalMetaData.monthYearPick) {
            field.additionalMetaData.startView = 'multi-year';
        }
        if (!this.additionalMetaData.hasOwnProperty('changeEventEmit')) {
            this.additionalMetaData.changeEventEmit = true;
        }
    }
}

type FieldType = 'date';

interface MetadataBuilder {
    customDateClasses?: Array<CustomDateClasses>;
    startAt?: number | null;
    startView?: StartView;
    touchUi?: boolean | null;
    minDate?: number | null;
    maxDate?: number | null;
    monthYearPick?: boolean;
    showLabel?: boolean;
    fieldConfig?: FieldConfig;
    changeEventEmit?: boolean;
}

type StartView = 'month' | 'year' | 'multi-year';
