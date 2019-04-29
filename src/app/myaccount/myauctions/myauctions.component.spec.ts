import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyauctionsComponent } from './myauctions.component';

describe('MyauctionsComponent', () => {
  let component: MyauctionsComponent;
  let fixture: ComponentFixture<MyauctionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyauctionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyauctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
