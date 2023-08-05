import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatRatingComponent } from './mat-rating.component';

describe('MatRatingComponent', () => {
  let component: MatRatingComponent;
  let fixture: ComponentFixture<MatRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
