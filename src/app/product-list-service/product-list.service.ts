import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Global } from '../global';


@Injectable({
  providedIn: 'root'
})
export class ProductListService {
  cart = new BehaviorSubject<any>({ products: [], totalQuantity: 0, totalPrice: 0 });
  
  constructor(private http:HttpClient) { }

  getProductList():Observable<any>{
    return this.http.get(Global.GET_PTODUCT_LIST);
  }
}
