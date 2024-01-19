import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLandRecordPageComponent } from './view-land-record-page.component';

describe('ViewLandRecordPageComponent', () => {
  let component: ViewLandRecordPageComponent;
  let fixture: ComponentFixture<ViewLandRecordPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewLandRecordPageComponent]
    });
    fixture = TestBed.createComponent(ViewLandRecordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
