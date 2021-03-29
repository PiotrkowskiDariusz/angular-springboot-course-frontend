import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // new properties for pagination
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;

  previousKeyWord: string = null;

  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
    
  }

  handleSearchProducts() {

    const keyWord: string = this.route.snapshot.paramMap.get('keyword');

    // if we have a different keyword than previous set pageNumber to 1
    if(this.previousKeyWord != keyWord) {
      this.pageNumber = 1;
    }

    this.previousKeyWord = keyWord;
    console.log(`keyWord: ${keyWord}, pageNumber: ${this.pageNumber}`);

    // search for products using keyword
    this.productService.searchProductsPaginate(this.pageNumber - 1,
                                              this.pageSize,
                                              keyWord).subscribe(this.processResult());
  }

  handleListProducts() {
    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" and convert to a number using '+'
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    }
    else {
      // no category id... default to one
      this.currentCategoryId = 1;
    }

    // check if we have a different category than previous
    // Angular will reuse a component if it is currently being viewed

    // different category id than previous set pageNumber to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, pageNumber=${this.pageNumber}`);

    // get the products for given id
    this.productService.getProductListPaginate(this.pageNumber - 1, 
                                              this.pageSize, 
                                              this.currentCategoryId)
                                              .subscribe(this.processResult())
  }

  processResult() {
    return data => {
      this.products = data._embedded.products
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    }
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

}
