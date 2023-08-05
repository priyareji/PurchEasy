import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialListComponent } from './material-list/material-list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { ContentViewComponent, ContentTitle, ContentArea, ContentInsights } from './content-view/content-view.component';
import { FormViewComponent, FormTitle, FormContentArea, FormInsights } from './form-view/form-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PipeModule } from '@app/shared';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LoaderModule } from '../loader/loader.module';
import { MatPaginatorModule } from '@angular/material/paginator';



@NgModule({
  declarations: [
    MaterialListComponent,
    ContentViewComponent,
    FormViewComponent,
    ContentTitle,
    ContentArea,
    ContentInsights,
    FormTitle,
    FormContentArea,
    FormInsights,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatSortModule,
    FlexLayoutModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatButtonModule,
    MatTooltipModule,
    // ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    // MatProgressBarModule,
    PipeModule,
    MatMenuModule,
    LoaderModule,
    MatRippleModule
  ],
  exports: [
    MaterialListComponent,
    ContentViewComponent,
    FormViewComponent,
    ContentTitle,
    ContentArea,
    ContentInsights,
    FormTitle,
    FormContentArea,
    FormInsights,
  ]
})
export class UIModule { }
