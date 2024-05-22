import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from '../../shared/services/product.service';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { NewProductComponent } from '../new-product/new-product.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  private productService = inject(ProductService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);


  ngOnInit(): void {
    this.getProducts();
  }

  displayedColumns: string[] = ['id',  'category','name', 'price', 'account','actions'];
  dataSource = new MatTableDataSource<ProductElement>();

  @ViewChild(MatPaginator)
  paginator !: MatPaginator;

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
  const dateProduct: ProductElement[] = [];  
  if (resp.metadata.code == "00"){
    let listProduct = resp.product.products;

    listProduct.forEach((element: ProductElement) => {
      //element.category = element.category;
      dateProduct.push(element);

    });

    // set DataSource
    this.dataSource = new MatTableDataSource<ProductElement>(dateProduct);
    this.dataSource.paginator = this.paginator;
  }
  }
  openProductDialog(){
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: '450px'
    });
dialogRef.afterClosed().subscribe((result:any) => {
  
  if (result == 1){

    this.openSnackBar("Producto agregado", "Éxito");
    this.getProducts();
  } else if (result == 2){
this.openSnackBar("Se produjo un error al guardar el producto", "Error");
  }
})
  }
  openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action, {
      duration: 2000
    })
  }

  edit(id: number, name: string, price: number, account: number, category: any){
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: '450 px',
      data: {id: id, name: name, price: price, account: account, category: category}
    });

    dialogRef.afterClosed().subscribe((result:any) => {
  
      if (result == 1){
    
        this.openSnackBar("Producto actualizado", "Éxito");
        this.getProducts();
      } else if (result == 2){
    this.openSnackBar("Se produjo un error al actualizar el producto", "Error");
      }
    });
  }

}

export interface ProductElement {

  id: number;
  name: string;
  price: number;
  account: number;
  category: any;
}
