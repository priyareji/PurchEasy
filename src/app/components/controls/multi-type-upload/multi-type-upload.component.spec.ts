import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiTypeUploadComponent } from './multi-type-upload.component';

describe('MultiTypeUploadComponent', () => {
  let component: MultiTypeUploadComponent;
  let fixture: ComponentFixture<MultiTypeUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiTypeUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiTypeUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
