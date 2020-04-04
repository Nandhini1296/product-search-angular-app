import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoundProgressModule } from 'angular-svg-round-progressbar'; 

import { AppComponent } from './app.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { ResultsTableComponent } from './results-table/results-table.component';
import { WishListComponent } from './wish-list/wish-list.component';

import { HttpClientModule } from '@angular/common/http';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ResultsListComponent } from './results-list/results-list.component';
import { SimilarProductsComponent } from './similar-products/similar-products.component';
import { MatTooltipModule } from '@angular/material';
// import { HostListener } from '@angular/core';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    ProductFormComponent,
    ResultsTableComponent,
    WishListComponent,
    ProductDetailsComponent,
    ResultsListComponent,
    SimilarProductsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatAutocompleteModule, 
    MatFormFieldModule,
    MatInputModule, 
    HttpClientModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    RoundProgressModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
