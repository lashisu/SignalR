import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRegisterDialogComponent } from './login-register-dialog.component';

describe('LoginRegisterDialogComponent', () => {
  let component: LoginRegisterDialogComponent;
  let fixture: ComponentFixture<LoginRegisterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginRegisterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginRegisterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
