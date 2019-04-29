import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromisComponent } from './promis.component';

describe('PromisComponent', () => {
  let component: PromisComponent;
  let fixture: ComponentFixture<PromisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
