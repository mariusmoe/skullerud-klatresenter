import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertSelectionComponent } from './alert-selection.component';

describe('AlertSelectionComponent', () => {
  let component: AlertSelectionComponent;
  let fixture: ComponentFixture<AlertSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
