import { Component, OnInit, inject } from '@angular/core';
import { ProductElement } from '../../../product/product/product.component';
import { ProductService } from '../../../shared/services/product.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  chartBar: any;
  chartDoughnut: any;

  private productService = inject(ProductService);

  ngOnInit(): void {

    this.getProducts();
    
  }
  getProducts(){

    this.productService.getProducts()
    .subscribe((data: any)=>{
      console.log("respuesta de productos: ",data);
      this.processProductResponse(data);
    }, (error:any) => {
      console.log("error en productos: ", error)
    })
  }

  processProductResponse(resp: any){
  
    const nameProduct: String [] = [];
    const account: number [] = [];

  if (resp.metadata.code == "00"){
    let listProduct = resp.product.products;

    listProduct.forEach((element: ProductElement) => {
      nameProduct.push(element.name);
      account.push(element.account);
    });

    this.chartBar = new Chart('canvas-bar', {
      type: 'bar',
      data: {
        labels: nameProduct,
        datasets: [
          {label: 'Productos', data: account}
        ]
      }
    });

    this.chartDoughnut = new Chart('canvas-doughnut', {
      type: 'doughnut',
      data: {
        labels: nameProduct,
        datasets: [
          {label: 'Productos', data: account}
        ]
      }
    });

  }
}

}
