import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLandRecordComponent } from './edit-land-record.component';

describe('EditLandRecordComponent', () => {
  let component: EditLandRecordComponent;
  let fixture: ComponentFixture<EditLandRecordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditLandRecordComponent]
    });
    fixture = TestBed.createComponent(EditLandRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
