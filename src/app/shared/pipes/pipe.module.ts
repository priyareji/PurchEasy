import { NgModule } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { ObjectKeysPipe } from './object-keys/object-keys.pipe';
import { ObjectFilterPipe } from './object-filter/object-filter.pipe';
import { SafeDomPipe } from './safe-dom/safe-dom.pipe';
import { Nl2brPipe } from './nl2br/nl2br.pipe';
import { ArrToStrPipe } from './arr-to-str/arr-to-str.pipe';
import { RangeDateTimePipe } from './range-date-time/range-date-time.pipe';
import { StringReplacerPipe } from './string-replacer/string-replacer.pipe';
import { ContentFormatterPipe } from './content-formatter/content-formatter.pipe';
import { HandleBarPipe } from './handle-bar/handle-bar.pipe';
import { AbbreviateNumberPipe } from './abbreviate-number/abbreviate-number.pipe';
import { CountPipe } from './count/count.pipe';

@NgModule({
	imports: [CommonModule],
	declarations: [
		ObjectKeysPipe,
		ObjectFilterPipe,
		SafeDomPipe,
		Nl2brPipe,
		ArrToStrPipe,
		RangeDateTimePipe,
		StringReplacerPipe,
		ContentFormatterPipe,
		HandleBarPipe,
		AbbreviateNumberPipe,
		CountPipe
	],
	exports: [
		ObjectKeysPipe,
		ObjectFilterPipe,
		SafeDomPipe,
		Nl2brPipe,
		ArrToStrPipe,
		RangeDateTimePipe,
		StringReplacerPipe,
		ContentFormatterPipe,
		HandleBarPipe,
		UpperCasePipe,
		AbbreviateNumberPipe,
		CountPipe
	],
	providers: [
		ObjectKeysPipe,
		ObjectFilterPipe,
		SafeDomPipe,
		Nl2brPipe,
		ArrToStrPipe,
		RangeDateTimePipe,
		StringReplacerPipe,
		ContentFormatterPipe,
		HandleBarPipe,
		UpperCasePipe,
		AbbreviateNumberPipe,
		CountPipe
	]
})
export class PipeModule { }
