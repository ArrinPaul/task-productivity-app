import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Category } from '../../../models/category.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  categoryName = '';

  constructor(
    public dialogRef: MatDialogRef<CategoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category,
  ) {}

  ngOnInit(): void {
    this.categoryName = this.data?.name || '';
  }

  save(form: NgForm): void {
    if (form.valid) {
      this.dialogRef.close({ name: this.categoryName.trim() });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
