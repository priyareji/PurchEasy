import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsibleBlockComponent } from './collapsible-block.component';

describe('CollapsibleBlockComponent', () => {
  let component: CollapsibleBlockComponent;
  let fixture: ComponentFixture<CollapsibleBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollapsibleBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollapsibleBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
