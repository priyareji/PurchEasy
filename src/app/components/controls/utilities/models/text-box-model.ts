import { SuperModel, FieldIcon, FieldConfig, Autofill } from './super-model';

export class TextBoxModel extends SuperModel {
  validationRegex: string | null;
  type: TextBoxType;
  fieldIcon?: FieldIcon;
  isReadonly: boolean = false;
  isHidden: boolean = false;
  fieldType!: FieldType;
  fieldColumn: string = '';
  isRequired: boolean = false;
  additionalMetaData: MetadataBuilder = {};
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
    if (!this.additionalMetaData.hasOwnProperty('min')) {
      this.additionalMetaData.min = null;
    }
    if (!this.additionalMetaData.hasOwnProperty('max')) {
      this.additionalMetaData.max = null;
    }
    if (!this.additionalMetaData.hasOwnProperty('minChar')) {
      this.additionalMetaData.minChar = null;
    }
    if (!this.additionalMetaData.hasOwnProperty('maxChar')) {
      this.additionalMetaData.maxChar = null;
    }
    if (!this.additionalMetaData.hasOwnProperty('capLock')) {
      this.additionalMetaData.capLock = false;
    }
    if (!this.additionalMetaData.hasOwnProperty('showLabel')) {
      this.additionalMetaData.showLabel = true;
    }
    if (!this.additionalMetaData.hasOwnProperty('autoFill')) {
      this.additionalMetaData.autoFill = 'on';
    }
    if (!this.additionalMetaData.hasOwnProperty('disablePaste')) {
      this.additionalMetaData.disablePaste = false;
    }
    if (!this.additionalMetaData.hasOwnProperty('changeEventEmit')) {
      this.additionalMetaData.changeEventEmit = true;
    }
    this.validationRegex = (field.hasOwnProperty('validationRegex')
      && !([null, undefined, ''].includes(field.validationRegex))) ? field.validationRegex : null;
    this.type = (field.hasOwnProperty('type')
      && !([null, undefined, ''].includes(field.type))) ? field.type : 'text';
    this.fieldIcon = (field.hasOwnProperty('fieldIcon')
      && !([null, undefined, ''].includes(field.fieldIcon))) ? field.fieldIcon : {};
  }
}

type FieldType = 'textBox';

interface MetadataBuilder {
  minChar?: number | null | undefined;
  maxChar?: number | null | undefined;
  min?: number | null | undefined;
  max?: number | null | undefined;
  capLock?: boolean;
  showLabel?: boolean;
  formatter?: string;
  showPasswordStrength?: boolean;
  patternMatch?: string;
  disablePaste?: boolean;
  autoFill?: Autofill;
  fieldConfig?: FieldConfig;
  changeEventEmit?: boolean;
}

type TextBoxType = 'text' | 'number' | 'email' | 'password' | 'url';
