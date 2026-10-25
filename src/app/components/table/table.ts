import { Component, input } from '@angular/core';
import { TableColumn } from '../../models/TableColumn';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-table',
  styleUrl: './table.scss',
  templateUrl: './table.html',
})
export class Table <T extends Object>{

 data = input.required<T[]>();
columns = input.required<TableColumn<T>[]>();


  
}
