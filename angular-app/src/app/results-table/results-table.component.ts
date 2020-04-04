import { Component, OnInit, Input } from '@angular/core';
import {
  animate, state, style, transition, trigger
} from '@angular/animations';
import { ProductFormComponent } from 'src/app/product-form/product-form.component';
import { DataService } from '../data.service';
import { ProductList } from '../product-list';

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.css'],
  animations: [
    trigger('slide_child', [
      state('results_list', style({ transform: 'translateX(0)' })),
      state( 'product_each' , style({ transform: 'translateX(-50%)' })),
      transition('* => *', animate(300))
  ])]
})

export class ResultsTableComponent implements OnInit {
  
  current_page_child: any;
  each_prod : ProductList;
  show_results:boolean;

  

  onEmitted(slide: PaneType){
    console.log('emitted now');
    console.log(slide);
    if (slide == 'results_list'){
      this.current_page_child = slide;
    } else {
      this.current_page_child = 'product_each';
      this.each_prod = slide;
    }
  }
  constructor(private data: DataService) { }

  ngOnInit() {
    
  }

}
type PaneType = 'results_list' | ProductList;

