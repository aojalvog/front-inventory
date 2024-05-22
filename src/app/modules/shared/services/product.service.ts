import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const base_url = "http://localhost:8080/youngold";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProducts(){
    const endpoint = `${base_url}/products`;
    return this.http.get(endpoint);
  }

  saveProduct(body: any){
    const endpoint = `${base_url}/products`;
    return this.http.post(endpoint, body);
  }

  updateProduct (body: any, id: any){
    const endpoint = `${base_url}/products/${id}`;
    return this.http.put(endpoint, body);
  }
}
