import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CategoryService } from '../../../shared/services/category.service';
import { MatTableDataSource } from '@angular/material/table';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NewCategoryComponent } from '../new-category/new-category.component';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from '../../../shared/component/confirm/confirm.component';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit{

  private categoryService = inject(CategoryService);
  public dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);


  ngOnInit(): void {
    this.getCategories();
  }

  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<CategoryElement>();

  @ViewChild(MatPaginator)
  paginator !: MatPaginator;

  getCategories(): void {
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
  


  processCategoriesResponse(resp: any){

    const dataCategory: CategoryElement[] = [];

    if( resp.metadata.code === "00"){
      let listCategory = resp.categoryResponse.category;

      listCategory.forEach((element: CategoryElement) => {
        dataCategory.push(element);
      });

      this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory);
      this.dataSource.paginator = this.paginator;
    }

  }
  
  openCategoryDialog(){
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px'
    });
dialogRef.afterClosed().subscribe((result:any) => {
  
  if (result == 1){

    this.openSnackBar("Categoria actualizada", "Éxito");
    this.getCategories();
  } else if (result == 2){
this.openSnackBar("Se produjo un error al actualizar la categoría", "Error");
  }
})
  }

  buscar(termino: string){
    if(termino.length === 0){
      return this.getCategories();
    }
    this.categoryService.getCategoriesById(termino)
    .subscribe((resp: any) => {
      this.processCategoriesResponse(resp);
    })
  }

  delete(id:any){
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '450px',
      data: {id: id, module: "category"}
    });
dialogRef.afterClosed().subscribe((result:any) => {
  
  if (result == 1){

    this.openSnackBar("Categoria eliminada", "Éxito");
    this.getCategories();
  } else if (result == 2){
this.openSnackBar("Se produjo un error al eliminar la categoría", "Error");
  }
})
  }
  edit(id: number, name: string){
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px',
      data: {id: id, name: name}
    });
dialogRef.afterClosed().subscribe((result:any) => {
  
  if (result == 1){

    this.openSnackBar("Categoria agregada", "Éxito");
    this.getCategories();
  } else if (result == 2){
this.openSnackBar("Se produjo un error al crear la categoría", "Error");
  }
})
  }
  openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action, {
      duration: 2000
    })
  }
}

export interface CategoryElement{
  id: number;
  name: string;
}
