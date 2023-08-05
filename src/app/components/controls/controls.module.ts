import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

import { HelpLineComponent } from './addons/help-line/help-line.component';
import { TextBoxComponent } from './text-box/text-box.component';
import { TextAreaComponent } from './text-area/text-area.component';
import { DropDownComponent } from './drop-down/drop-down.component';
import { AutoCompleteComponent } from './auto-complete/auto-complete.component';
import { InternationalPhoneNumberComponent } from './international-phone-number/international-phone-number.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { RadioComponent } from './radio/radio.component';
import { CheckBoxComponent } from './check-box/check-box.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { BuilderService } from './utilities/services/builder.service';
import { FunctionsService } from './utilities/services/functions.service';
import { OwlDatePickerComponent } from './owl-date-picker/owl-date-picker.component';
import { ImageCropComponent } from './image-crop/image-crop.component';
import { MatRatingComponent } from './mat-rating/mat-rating.component';
import { MatNativeDateModule } from '@angular/material/core';
import { PipeModule } from '@app/shared/pipes/pipe.module';
import { DirectivesModule } from '@app/shared/directives/directives.module';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChipsModule } from '../chips/chips.module';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { MultiTypeUploadComponent } from './multi-type-upload/multi-type-upload.component';
import { MatRippleModule } from '@angular/material/core';
import { PopupComponent as ImageUploadPopupComponent } from './image-upload/popup/popup.component';
import { QuillEditorComponent } from './quill-editor/quill-editor.component';
import { QuillModule } from 'ngx-quill';

@NgModule({
	declarations: [
		HelpLineComponent,
		TextBoxComponent,
		TextAreaComponent,
		DropDownComponent,
		AutoCompleteComponent,
		InternationalPhoneNumberComponent,
		DatePickerComponent,
		RadioComponent,
		CheckBoxComponent,
		FileUploadComponent,
		OwlDatePickerComponent,
		ImageCropComponent,
		MatRatingComponent,
		QuillEditorComponent,
		AdvancedSearchComponent,
		ImageUploadComponent,
		MultiTypeUploadComponent,
		ImageUploadPopupComponent,
	],
	imports: [
		CommonModule,
		FlexLayoutModule,
		MatFormFieldModule,
		MatTooltipModule,
		MatInputModule,
		MatSelectModule,
		MatIconModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatCheckboxModule,
		MatRadioModule,
		MatButtonModule,
		MatAutocompleteModule,
		MatChipsModule,
		FormsModule,
		ReactiveFormsModule,
		Ng2TelInputModule,
		MatChipsModule,
		OwlDateTimeModule,
		OwlNativeDateTimeModule,
		MatSliderModule,
		PipeModule,
		DirectivesModule,
		MatMenuModule,
		MatProgressSpinnerModule,
		ChipsModule,
		QuillModule.forRoot(),
		MatRippleModule
	],
	exports: [
		TextBoxComponent,
		TextAreaComponent,
		DropDownComponent,
		AutoCompleteComponent,
		InternationalPhoneNumberComponent,
		DatePickerComponent,
		RadioComponent,
		CheckBoxComponent,
		FileUploadComponent,
		OwlDatePickerComponent,
		QuillEditorComponent,
		ImageCropComponent,
		MatRatingComponent,
		AdvancedSearchComponent,
		ImageUploadComponent,
		MultiTypeUploadComponent,
	],
	entryComponents: [
		ImageUploadPopupComponent
	],
	providers: [BuilderService, FunctionsService]
})
export class ControlsModule { }
