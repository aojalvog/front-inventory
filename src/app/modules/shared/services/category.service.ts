import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const base_url = "http://localhost:8080/youngold";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories(){
    
    const endpoint = `${base_url}/categories`;
    return this.http.get(endpoint);
  }

  saveCategories(body: any){

    const endpoint = `${base_url}/categories`;
    return this.http.post(endpoint, body);

  }

  updateCategories(body: any, id: any){

    const endpoint = `${base_url}/categories/${id}`;
    return this.http.put(endpoint, body, id);

  }
  deleteCategories(id: any){

    const endpoint = `${base_url}/categories/${id}`;
    return this.http.delete(endpoint, id);

  }

  getCategoriesById(id: any){
    const endpoint = `${base_url}/categories/${id}`;
    return this.http.get(endpoint);
  }
}
