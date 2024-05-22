import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../shared/services/product.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../shared/services/category.service';

export interface Category {
  id: number;
  name: string;
}
@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css'
})
export class NewProductComponent implements OnInit{

  private fb = inject(FormBuilder);
  private categoryService= inject(CategoryService);
  private dialogRef= inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);

  private productService = inject(ProductService);

  public productForm!: FormGroup;

  estadoFormulario: string = "";
  categories: Category[]=[];

  ngOnInit(): void {
    this.getCategories();

    this.estadoFormulario = "Agregar nuevo";
    this.productForm = this.fb.group( {
      name: ['', Validators.required],
      price: ['', Validators.required],
      account: ['', Validators.required],
      category: ['', Validators.required]

    })
    if (this.data != null){
      this.updateForm(this.data);
      this.estadoFormulario = "Actualizar"
    }
    
    
  }

  onSave(){
    let data = {
      name: this.productForm.get('name')?.value,
      price: this.productForm.get('price')?.value,
      account: this.productForm.get('account')?.value,
      category: this.productForm.get('category')?.value
    }
  
    console.log('Valor de category:', data.category); // Agrega esta línea
  
    const uploadData = new FormData();
    uploadData.append('name', data.name);
    uploadData.append('price', data.price);
    uploadData.append('account', data.account);
    uploadData.append('categoryId', data.category['id']);
    if(this.data != null){
      // update
      this.productService.updateProduct(uploadData, this.data.id)
                          .subscribe((data: any)=> {
         this.dialogRef.close(1);
      }, (error: any) => {
        this.dialogRef.close(2);
      })

    } else {
      
      this.productService.saveProduct(uploadData)
      .subscribe((data: any)=> {
        this.dialogRef.close(1);
      }, (error: any) => {
        this.dialogRef.close(2);
      })
    }
  }
  

  onCancel(){

    this.dialogRef.close(3);
  }

  getCategories(){
    this.categoryService.getCategories()
    .subscribe((data: any) => {
      this.categories = data.categoryResponse.category
    }, (error: any) => {
      console.log("Error al consultar categorías");
    })
  }

  updateForm(data: any){
    this.productForm = this.fb.group( {
      name: [data.name, Validators.required],
      price: [data.price, Validators.required],
      account: [data.account, Validators.required],
      category: [data.category, Validators.required]

    })
  }

}
