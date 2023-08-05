import { Component, OnInit, Inject, AfterViewInit, ViewChild, ViewContainerRef, ComponentRef, OnDestroy, ElementRef, ChangeDetectorRef, Injector, isDevMode } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalFunctionService } from '@app/shared/services/global-function.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { FormGroup } from '@angular/forms';
import { GlobalApiService } from '@app/shared/services/global-api.service';
import { AppInitService } from '@app/app-initializer.service';
import { BuilderService } from '@app/components/controls/utilities/services/builder.service';
import { ApiService as ProductCategoryApiService } from '@app/modules/product-category/utilities/services/api.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-popup',
	templateUrl: './popup.component.html',
	styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild('content', { read: ViewContainerRef })
	vcRef!: ViewContainerRef;
	@ViewChild('buttonContainer') set focus(buttonContainer: ElementRef) {
		if (buttonContainer && this.data.action === 'alert') {
			setTimeout(() => {
				if (Array.isArray(this.data.buttons)) {
					const childButtons = buttonContainer.nativeElement.children;
					for (let i = 0; i < childButtons.length; i++) {
						if (childButtons[i].autofocus) {
							childButtons[i].focus();
							break;
						}
					}
				}
			}, 100);
		}
	};
	@ViewChild('sample') sample!: ElementRef;

	componentRef!: ComponentRef<any>;
	dialogCloseData: any;
	loader: boolean = true;
	formObject: any;
	form!: FormGroup;
	submitDisable = false;
	clearTimeout: any;
	popupLoader = false;
	componentReference: any;
	formFields: any = [];
	config = { fxFlex: 100 };
	baseService: any;
	isDev = isDevMode();
	addScrollClass = false;

	constructor(
		public dialogRef: MatDialogRef<PopupComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any = {},
		public gfService: GlobalFunctionService,
		public locale: LocaleService,
		private cdref: ChangeDetectorRef,
		private controlService: BuilderService,
		private globalApiService: GlobalApiService,
		private productCategoryApiService: ProductCategoryApiService,
		private appInit: AppInitService,
		private injector: Injector
	) {
		if (!navigator.onLine) {
			this.dialogRef.close();
		}
		this.injectService();
	}

	async injectService() {
		const service = await import('@app/shared/services/base.service');
		this.baseService = this.injector.get(service.BaseService);
	}

	async ngOnInit() {
	}

	async ngAfterViewInit() {
		if (navigator.onLine) {
			if (this.data.action === 'dynamic') {
				setTimeout(async () => {
					let data = [];
					if (this.data.componentData) {
						data = this.data.componentData;
						if (typeof this.data.componentData === 'object' && !Array.isArray(this.data.componentData)) {
							data = [this.data.componentData];
						}
					}
					data = data.concat([{ variableName: 'popupRef', value: this.dialogRef }]);
					this.componentReference = await this.gfService.loadComponent(this.data.component, this.vcRef, data);
					if (this.componentReference && this.componentReference.addScrollClassToPopup) {
						this.addScrollClass = true;
					}
					this.loader = false;
				});
			} else if (this.data.action === 'filter') {
				this.form = this.controlService.formGroupBuilder(this.data.fieldList);
				this.formObject = { form: this.form, fields: this.data.fieldList };
				let subscribe: Subscription;
				const productCategoryField = this.data.fieldList.find((items: any) => items.fieldColumn === 'productCategoryID');
				if (productCategoryField && navigator.onLine) {
					this.form.controls.productCategoryID.valueChanges.subscribe((controlResp) => {
						if (subscribe && !subscribe['closed']) {
							subscribe.unsubscribe();
						}
						if (this.clearTimeout) {
							clearTimeout(this.clearTimeout);
						}
						this.clearTimeout = setTimeout(() => {
							if (controlResp && typeof controlResp === 'string') {
								const apiData = {
									searchString: controlResp
								};
								const header: any = {};
								let selectedValue: any[] = [];
								if (productCategoryField.selectedValue.length) {
									productCategoryField.selectedValue.map((items: any) => {
										if (items.isAdd && !items.isDelete) {
											selectedValue.push(items.key);
										}
									});
								}
								subscribe = this.productCategoryApiService.getParentCategoryLeafList(apiData, header).subscribe(
									(response: any) => {
										if (response && response.records.length) {
											if (selectedValue.length) {
												response.records = response.records.filter(items => {
													if (!selectedValue.includes(items.ID)) {
														return items;
													}
												});
											}
											productCategoryField.options = response.records.map((data) => {
												return {
													key: data.ID,
													value: data.crumb
												};
											});
										} else {
											productCategoryField.options = [];
										}
									},
									(error) => {
										this.gfService.errorHandler(error, {
											snackBar: {
												position: 'before'
											}
										});
										productCategoryField.options = [];
									}
								);
							} else {
								productCategoryField.options = [];
							}
						}, this.appInit.configuration.searchDelay);
					});
				}
				this.loader = false;
			} else if (this.data.action === 'alert') {
				this.loader = false;
				this.cdref.detectChanges();
				// setTimeout(() => {
				// 	if (Array.isArray(this.data.buttons)) {
				// 		const childButtons = this.buttonContainer.nativeElement.children;
				// 		for (let i = 0; i < childButtons.length; i++) {
				// 			if (childButtons[i].autofocus) {
				// 				childButtons[i].focus();
				// 				break;
				// 			}
				// 		}
				// 	}
				// }, 100);
			}
		}
	}

	submit() {
		if (navigator.onLine) {
		}
	}

	updatePreference() {
		if (this.formObject && this.formObject.form) {
			this.submitDisable = true;
			if (this.formObject.form.valid) {
				this.loader = true;
				const formValue = this.gfService.fieldSubmitApiValueConstruct(
					this.formObject.form.getRawValue(),
					this.formObject.fields
				);
				sessionStorage.setItem('locale', formValue.language);
				this.locale.switchLanguage(formValue.language);
				this.loader = false;
				this.submitDisable = false;
				if (this.gfService.sessionUser.resourceTypes) {
					delete this.gfService.sessionUser.resourceTypes;
				}
				this.dialogRef.close();
			}
		}
	}

	formObjectReader(record: any) {
		this.formObject = record;
	}

	// routeWorkgroup() {
	// 	if (navigator.onLine) {
	// 		this.dialogRef.close();
	// 		const queryParams: any = {
	// 			tab: 'joined_workgroups',
	// 			send_request: 'active'
	// 		};
	// 		this.gfService.routeNavigation('/workgroup', queryParams);
	// 	}
	// }

	searchPeopleDetail(data: any) {
		if (data && data.userID) {
			this.baseService.userDetail(data.userID);
		}
	}

	close(popupClose: boolean = false) {
		if (navigator.onLine) {
			// if (!popupClose && this.baseService.formView && !this.isDev && this.data.action !== 'alert') {
			// 	this.alertPopup();
			// 	return;
			// }

			if (this.componentReference && this.componentReference.dialogClose) {
				this.componentReference.dialogClose();
			} else {
				this.dialogRef.close(this.dialogCloseData || 'close');
			}
			this.baseService.resourcePopupTriggered = false;
		}
	}

	// alertPopup() {
	// 	const dialogRef = this.popup.open(PopupComponent, {
	// 		panelClass: ['custom-panel'],
	// 		autoFocus: false,
	// 		data: {
	// 			action: 'alert',
	// 			classes: 'warning',
	// 			popup: true,
	// 			icon: 'warning',
	// 			title: this.locale.translate('close_form'),
	// 			content: this.locale.translate('close_form_text'),
	// 			buttons: [
	// 				{
	// 					type: 'main-action',
	// 					caption: this.locale.translate('yes'),
	// 					key: 'yes'
	// 				},
	// 				{
	// 					type: 'main-action-cancel',
	// 					caption: this.locale.translate('no'),
	// 					key: 'no',
	// 					autoFocus: true
	// 				}
	// 			]
	// 		},
	// 		disableClose: true,
	// 		maxWidth: '560px'
	// 	});
	// 	dialogRef.afterClosed().subscribe((resp) => {
	// 		if (resp) {
	// 			if (resp.key === 'yes') {
	// 				this.close(true);
	// 			}
	// 		}
	// 	});
	// }


	buttonTrigger(data: any) {
		this.dialogRef.close(data);
	}

	getFlexOptions() {
		return '1 1 200px';
	}

	search() {
		if (navigator.onLine) {
			if (this.formObject && this.formObject.form) {
				this.submitDisable = true;
				if (this.formObject.form.valid) {
					this.loader = true;
					const formValue = this.gfService.fieldSubmitApiValueConstruct(
						this.formObject.form.getRawValue(),
						this.formObject.fields
					);
					this.dialogRef.close(this.gfService.JSONMerge({
						formValue
					}, this.formObject));
				} else {
					this.gfService.fieldControlMarkAsTouched(this.formObject.fields, this.formObject.form);
					this.submitDisable = false;
				}
			}
		}
	}

	ngOnDestroy() {
		if (this.data.triggerEl) {
			const el: HTMLElement = this.data.triggerEl['_elementRef'].nativeElement;
			setTimeout(() => {
				el.blur();
			});
		}
		if (this.baseService.formView && this.data.action !== 'alert') {
			this.baseService.formView = false;
		}

	}
}
