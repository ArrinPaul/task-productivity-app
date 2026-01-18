import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyPerformanceComponent } from './weekly-performance.component';

describe('WeeklyPerformanceComponent', () => {
  let component: WeeklyPerformanceComponent;
  let fixture: ComponentFixture<WeeklyPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyPerformanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeeklyPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
