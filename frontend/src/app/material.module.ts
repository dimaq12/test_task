import { NgModule } from '@angular/core';

import { MatCardModule } from "@angular/material/card"
import { MatInputModule} from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatFormFieldModule } from '@angular/material/form-field';
import { DragDropModule } from '@angular/cdk/drag-drop'

const modules = [
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatFormFieldModule,
  DragDropModule
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule {}
