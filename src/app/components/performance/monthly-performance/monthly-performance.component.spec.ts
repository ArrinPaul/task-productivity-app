import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyPerformanceComponent } from './monthly-performance.component';

describe('MonthlyPerformanceComponent', () => {
  let component: MonthlyPerformanceComponent;
  let fixture: ComponentFixture<MonthlyPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyPerformanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonthlyPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
