import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinijuegosComponent } from './minijuegos.component';

describe('MinijuegosComponent', () => {
  let component: MinijuegosComponent;
  let fixture: ComponentFixture<MinijuegosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinijuegosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MinijuegosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
