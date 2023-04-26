import { Component, OnInit } from '@angular/core';
import { ProductListService } from '../product-list-service/product-list.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart: any = {};
  cartProducts: any = [];
  totalPrice: any = 0;
  limit: boolean = false;
  constructor(private productListService: ProductListService) { }

  ngOnInit(): void {
    this.productListService.cart.subscribe(cart => {
      this.cart = cart;
      this.cartProducts = this.cart.products;
      this.totalPrice = this.cart.totalPrice;
    })
  }

  updateCart(product: any, action: any) {
    this.limit = false;
    if (action === 'ADD') {
      if (product.cartQuantity < product.quantity) {
        this.cart.totalQuantity++;
        this.cart.totalPrice += product.price;
        let existingItemIndex = this.cart.products.findIndex((prod: any) => prod.id === product.id)
        if (existingItemIndex > -1) {
          this.cart.products[existingItemIndex].cartQuantity = this.cart.products[existingItemIndex].cartQuantity + 1;
          // product.cartQuantity++;
          // console.log(product.cartQuantity, this.cart)
        } else {
          product.cartQuantity = 1;
          this.cart.products.push({ ...product });
        }
      } else if (product.cartQuantity == product.quantity) {
        this.limit = true;
        setTimeout(() => { this.limit = false; }, 3000);
        // console.log("reached limit");
      }
    } else if (action === 'REMOVE') {
      this.cart.totalQuantity--;
      this.cart.totalPrice -= product.price;
      let existingItemIndex = this.cart.products.findIndex((prod: any) => prod.id === product.id)
      this.cart.products[existingItemIndex].cartQuantity = this.cart.products[existingItemIndex].cartQuantity - 1;
      // product.cartQuantity--;
      if (product.cartQuantity == 0) {
        let prods = this.cart.products.filter((prod: any) => prod.id != product.id);
        this.cart.products = prods;
      }
      // console.log(product.cartQuantity)
    }
    else if (action === 'REMOVE ALL') {
      this.cart.totalQuantity -= product.cartQuantity;
      this.cart.totalPrice -= product.price * product.cartQuantity;
      product.cartQuantity = 0;
      let prods = this.cart.products.filter((prod: any) => prod.id != product.id);
      this.cart.products = prods;
    }
    // console.log(this.cart)
    this.productListService.cart.next(this.cart);
  }
}
