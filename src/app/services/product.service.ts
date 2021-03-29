import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8081/api/products';
  private categoryUrl = 'http://localhost:8081/api/product-category';

  constructor(private httpClient: HttpClient) { }

  getProduct(productId: number): Observable<Product> {
    
    // build URL based on product ID
    const productUrl = `${this.baseUrl}/${productId}`;

    return this.httpClient.get<Product>(productUrl);

  }

  getProductListPaginate(page: number, 
                        pageSize: number, 
                        categoryId: number): Observable<GetResponseProducts> {

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`
                    + `&page=${page}&size=${pageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductList(categoryId: number): Observable<Product[]> {

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;

    return this.getProducts(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );

  }
  
  searchProducts(keyWord: string): Observable<Product[]> {
    
    // need to build URL based on keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyWord}`;

    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(page: number, 
                        pageSize: number, 
                        keyWord: string): Observable<GetResponseProducts> {

    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyWord}`
                    + `&page=${page}&size=${pageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
}

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
