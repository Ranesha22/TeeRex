import { Component, OnInit } from '@angular/core';
import { ProductListService } from '../product-list-service/product-list.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  originalProductsList: any = []
  productsList: any = [];
  searchText: any = "";
  filterDictionary = new Map();
  genderFilter: any[] = [];
  colorFilter: any[] = [];
  typeFilter: any[] = [];
  maxPrice: any = 0;
  minPriceFilter: any = 0;
  maxPriceFilter: any = 0;
  cart: any = { products: [], totalQuantity: 0, totalPrice: 0 };
  limit: boolean = false;
  constructor(private productList: ProductListService) { }

  ngOnInit(): void {
    this.productList.getProductList().subscribe(res => {
      this.productsList = this.originalProductsList = res;
      this.genderFilter = [...new Set(this.productsList.map((product: any) => product.gender))];
      this.colorFilter = [...new Set(this.productsList.map((product: any) => product.color))];
      this.typeFilter = [...new Set(this.productsList.map((product: any) => product.type))];
      this.productList.cart.subscribe(res => this.cart = res);
      this.productsList.forEach((product: any) => {
        this.maxPrice = Math.max(product.price, this.maxPrice);
        if (this.cart.products.length > 0) {
          let ind = this.cart.products.findIndex((prod: any) => prod.id === product.id);
          product.cartQuantity = ind == -1 ? 0 : this.cart.products[ind].cartQuantity
        } else
          product.cartQuantity = 0;
        ;
      });
      this.maxPriceFilter = this.maxPrice;
    })
  }

  Search() {
    let words = this.searchText.toLowerCase().split(' ');
    // console.log(words);
    let dataSource = this.filterDictionary.size == 0 ? this.originalProductsList : this.productsList;
    const ans = dataSource.filter((product: any) => {
      let match = false;
      for (let word of words) {
        match = product.name.toLowerCase().includes(word) || product.color.toLowerCase().includes(word) || product.type.toLowerCase().includes(word) || (word === '');
        // console.log(match, word === '');
      };
      return match;
    })
    this.productsList = ans;
  }

  clearSearch() {
    this.searchText = "";
    if (this.filterDictionary.size == 0)
      this.productsList = this.originalProductsList;
    else
      this.applyFilter();
  }

  addPriceFilter() {
    this.filterDictionary.set('price', [Math.min(this.minPriceFilter, this.maxPriceFilter), Math.max(this.minPriceFilter, this.maxPriceFilter)]);
  }

  addFilters(event: any, field: any, value: any) {
    if (event.target.checked) {
      if (this.filterDictionary.get(field) != undefined)
        this.filterDictionary.get(field).push(value);
      else
        this.filterDictionary.set(field, [value]);
    }
    else {
      let vals = this.filterDictionary.get(field).filter((ele: any) => ele != value);
      if (vals.length > 0)
        this.filterDictionary.set(field, vals);
      else
        this.filterDictionary.delete(field);
    }
    // console.log(this.filterDictionary)
  }

  applyFilter() {
    // this.filterDictionary.set('price',[Math.min(this.minPriceFilter,this.maxPriceFilter),Math.max(this.minPriceFilter,this.maxPriceFilter)]);
    let dataSource = this.searchText === '' ? this.originalProductsList : this.productsList;
    let vals = dataSource.filter((product: any) => {
      let match = true;
      for (let [key, value] of this.filterDictionary.entries()) {
        let fieldMatch = false;
        if (key == 'price') {
          fieldMatch = product.price >= value[0] && product.price <= value[1];
        } else {
          for (let val of value) {
            fieldMatch ||= product[key] === val;
          }
        }
        match &&= fieldMatch;
      }
      return match;
    })
    // console.log(vals);
    this.productsList = vals;
  }

  clearFilters() {
    this.filterDictionary.clear();
    this.minPriceFilter = 0;
    this.maxPriceFilter = this.maxPrice;
    let checkbox = document.querySelectorAll('input[type="checkbox"]')
    for (let i = 0; i < checkbox.length; i++) {
      let check = checkbox[i] as HTMLInputElement;
      check.checked = false;
    }
    if (this.searchText == '')
      this.Search();
    else
      this.productsList = this.originalProductsList;
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
          product.cartQuantity++;
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
      product.cartQuantity--;
      if (product.cartQuantity == 0) {
        let prods = this.cart.products.filter((prod: any) => prod.id != product.id);
        this.cart.products = prods;
      }
      // console.log(product.cartQuantity)
    }

    this.productList.cart.next(this.cart);
  }

}
