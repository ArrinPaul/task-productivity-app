import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { TaskPriority } from '../models/task.model';

@Directive({
  selector: '[appTaskUrgencyHighlight]',
  standalone: true
})
export class TaskUrgencyHighlightDirective implements OnChanges {
  @Input('appTaskUrgencyHighlight') priority: TaskPriority = 'Low';
  @Input() dueDate: Date | string = new Date();
  @Input() completed = false;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['priority'] || changes['dueDate'] || changes['completed']) {
      this.applyStyles();
    }
  }

  private applyStyles(): void {
    const now = new Date();
    const deadline = new Date(this.dueDate);
    const isOverdue = !this.completed && deadline < now;
    const isHighPriority = this.priority === 'High' && !this.completed;

    this.renderer.removeStyle(this.elementRef.nativeElement, 'box-shadow');
    this.renderer.removeStyle(this.elementRef.nativeElement, 'border-left');

    if (isOverdue) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'border-left', '4px solid #dc2626');
      this.renderer.setStyle(this.elementRef.nativeElement, 'box-shadow', '0 8px 20px rgba(220, 38, 38, 0.25)');
      return;
    }

    if (isHighPriority) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'border-left', '4px solid #f59e0b');
      this.renderer.setStyle(this.elementRef.nativeElement, 'box-shadow', '0 8px 20px rgba(245, 158, 11, 0.2)');
    }
  }
}
