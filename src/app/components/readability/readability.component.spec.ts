import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadabilityComponent } from './readability.component';

describe('ReadabilityComponent', () => {
  let component: ReadabilityComponent;
  let fixture: ComponentFixture<ReadabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
