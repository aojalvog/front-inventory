import { Component, OnInit, inject } from '@angular/core';

import { Chart } from 'chart.js';

import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CategoryService } from '../../../shared/services/category.service';
import { ProductService } from '../../../shared/services/product.service';
import { CategoryElement } from '../../../category/components/category/category.component';
import { ProductElement } from '../../../product/product/product.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  chartBar: any;
  chartDoughnut: any;
  chartDoughnutCategory: any;

  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);

  categories: CategoryElement[] = [];
  products: ProductElement[] = [];
  categoryCounts: { [key: string]: number } = {};
  totalProducts: number = 0;

  ngOnInit(): void {
    this.getCategories();
    this.getProducts();
  }

  getCategories(): void {
    console.log("Llamando a getCategories");
    this.categoryService.getCategories().pipe(
      tap((data: any) => {
        console.log("respuesta categories: ", data);
        this.processCategoriesResponse(data);
      }),
      catchError((error: any) => {
        console.log("error: ", error);
        return throwError(error);
      })
    ).subscribe();
  }

  processCategoriesResponse(resp: any) {
    if (resp.metadata.code === "00") {
      this.categories = resp.categoryResponse.category;
      this.mapProductsToCategories();
    }
  }

  getProducts() {
    console.log("Llamando a getProducts");
    this.productService.getProducts().subscribe((data: any) => {
      console.log("respuesta de productos: ", data);
      this.processProductResponse(data);
    }, (error: any) => {
      console.log("error en productos: ", error);
    });
  }

  processProductResponse(resp: any) {
    if (resp.metadata.code == "00") {
      this.products = resp.product.products;
      this.totalProducts = this.products.reduce((sum, product) => sum + product.account, 0);

      this.products.forEach((product: ProductElement) => {
        const categoryName = product.category.name;
        if (!this.categoryCounts[categoryName]) {
          this.categoryCounts[categoryName] = 0;
        }
        this.categoryCounts[categoryName] += product.account;
      });

      this.updateProductChart();
      this.mapProductsToCategories();
    }
  }

  mapProductsToCategories() {
    if (this.categories.length > 0 && this.totalProducts > 0) {
      const nameCategory: String[] = [];
      const account: number[] = [];

      this.categories.forEach((element: CategoryElement) => {
        const categoryName = element.name;
        const categoryProductCount = this.categoryCounts[categoryName] || 0;
        const percentage = (categoryProductCount / this.totalProducts) * 100;

        nameCategory.push(categoryName);
        account.push(percentage);
      });

      this.updateCategoryChart(nameCategory, account);
    }
  }

  updateProductChart() {
    const nameProduct: String[] = [];
    const nameCategory: String [] = [];
    const account: number[] = [];

    this.products.forEach((element: ProductElement) => {
      nameProduct.push(element.name);
      nameCategory.push(element.category.name);
      console.log(nameCategory);
      account.push(element.account);
    });

    this.chartBar = new Chart('canvas-bar', {
      type: 'bar',
      data: {
        labels: nameProduct,
        datasets: [
          { label: 'Cantidad de productos', data: account }

        ]
      }
    });
    const labels = nameProduct.map((name, index) => `${name} (${nameCategory[index]})`);

    this.chartDoughnut = new Chart('canvas-doughnut-products', {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          { label: 'Cantidad', data: account },
        ]
      }
    });
  }

  updateCategoryChart(nameCategory: String[], account: number[]) {
    if (this.chartDoughnutCategory) {
      this.chartDoughnutCategory.destroy();
    }

    this.chartDoughnutCategory = new Chart('canvas-doughnut-categories', {
      type: 'doughnut',
      data: {
        labels: nameCategory,
        datasets: [
          { label: 'Porcentaje total', data: account }
         
        ]
      }
    });
  }
}
