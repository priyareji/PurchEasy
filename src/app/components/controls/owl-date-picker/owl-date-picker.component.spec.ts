import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwlDatePickerComponent } from './owl-date-picker.component';

describe('OwlDatePickerComponent', () => {
  let component: OwlDatePickerComponent;
  let fixture: ComponentFixture<OwlDatePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwlDatePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwlDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
