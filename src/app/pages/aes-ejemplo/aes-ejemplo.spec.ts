import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AesEjemplo } from './aes-ejemplo';

describe('AesEjemplo', () => {
  let component: AesEjemplo;
  let fixture: ComponentFixture<AesEjemplo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AesEjemplo],
    }).compileComponents();

    fixture = TestBed.createComponent(AesEjemplo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
