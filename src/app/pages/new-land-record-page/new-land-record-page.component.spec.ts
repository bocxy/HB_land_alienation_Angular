import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLandRecordPageComponent } from './new-land-record-page.component';

describe('NewLandRecordPageComponent', () => {
  let component: NewLandRecordPageComponent;
  let fixture: ComponentFixture<NewLandRecordPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewLandRecordPageComponent]
    });
    fixture = TestBed.createComponent(NewLandRecordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
