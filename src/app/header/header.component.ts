import { Component, OnInit } from '@angular/core';
import { ProductListService } from '../product-list-service/product-list.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  cartProduct : any = {};
  constructor(private productListService:ProductListService) { }

  ngOnInit(): void {
    this.productListService.cart.subscribe(cart=>{
      this.cartProduct = cart;
    })

  }

}
