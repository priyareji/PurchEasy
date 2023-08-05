import { SuperModel } from './super-model';

export class RadioModel extends SuperModel {
  options: Array<Options>;
  additionalMetaData: MetadataBuilder = {};
  isReadonly: boolean = false;
  isHidden: boolean = false;
  fieldType!: FieldType;
  fieldColumn: string = '';
  isRequired: boolean = false;
  constructor(field: any) {
    super(field);
    this.isRequired = field.isRequired;
    this.isHidden = field.isHidden;
    this.isReadonly = field.isReadonly;

    this.additionalMetaData = field.additionalMetaData;
    this.options = (field.hasOwnProperty('options')
      && Array.isArray(field.options)) ? field.options : [];
    if (!this.additionalMetaData.hasOwnProperty('isNone')) {
      this.additionalMetaData.isNone = true;
    }
    if (!this.additionalMetaData.hasOwnProperty('showLabel')) {
      this.additionalMetaData.showLabel = true;
    }
    if (!this.additionalMetaData.hasOwnProperty('changeEventEmit')) {
      this.additionalMetaData.changeEventEmit = true;
    }

  }
}

type FieldType = 'radio';

interface Options {
  key: string | number;
  value: string | number;
  disabled?: boolean;
  color?: string;
}
interface MetadataBuilder {
  isNone?: boolean;
  showLabel?: boolean;
  changeEventEmit?: boolean;
}
