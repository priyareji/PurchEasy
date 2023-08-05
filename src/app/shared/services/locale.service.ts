import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class LocaleService {
	localeContent: any = {};
	localeChangeDetect = new Subject<boolean>();

	constructor(private http: HttpClient) { }

	translate(key: string) {
		return this.localeContent[key] || 'UNKNOWN';
	}

	async switchLanguage(lang: string) {
		this.localeChangeDetect.next(true);
		const language = await this.loadFile(`assets/locale/${lang}.json`);
		this.localeContent = language.content;
		this.localeChangeDetect.next(false);
	}

	async loadFile(file: string): Promise<any> {
		return this.http.get(file).toPromise();
	}
}
