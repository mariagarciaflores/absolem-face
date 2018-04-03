import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { IProductId } from '../../interfaces/i-product-id';
import { IProduct } from '../../interfaces/i-product';

declare var $: any;
declare var Hammer: any;

@Component({
  selector: 'aps-ask-for-food',
  templateUrl: './ask-for-food.component.html',
  styleUrls: ['./ask-for-food.component.scss']
})
export class AskForFoodComponent implements OnInit, AfterViewInit {

  foodList: Array<any>;

  eatMeList: Array<any>;

  drinkMeList: Array<any>;

  pauseCarousel: boolean;

  orderDetails: Array<any>;

  eatMes: Observable<IProductId[]>;

  drinkMes: Observable<IProductId[]>;

  private eatMeCollection: AngularFirestoreCollection<IProduct>;

  private drinkMeCollection: AngularFirestoreCollection<IProduct>;

  constructor(private afs: AngularFirestore) {
    this.eatMeCollection = afs.collection<any>('products', ref => ref.where('type', '==', 'eatMe'));
    this.drinkMeCollection = afs.collection<any>('products', ref => ref.where('type', '==', 'drinkMe'));

    this.eatMes = this.eatMeCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as IProduct;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
    
    this.drinkMes = this.drinkMeCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as IProduct;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });

    this.pauseCarousel = false;

    this.orderDetails = new Array();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $('.carousel').on('slide.bs.carousel', () => {
      this.pauseCarousel = true;
    });

    $('.carousel').on('slid.bs.carousel', () => {
      this.pauseCarousel = false;
    });
  }

  swipeRight(product) {
    if (!this.pauseCarousel) {
      this.removeFromCart(product);
    }
  }

  swipeLeft(product) {
    if (!this.pauseCarousel) {
      this.next(product);
    }
  }

  buildOrder() {
    this.orderDetails = new Array();

    let orders = this.foodList.filter(
      food => food.quantity > 0
    );

    orders.forEach((current) => {
      this.orderDetails.push({
        product: current.name,
        amount: current.quantity,
        unitPrice: current.price,
        totalPrice: current.price * current.quantity,
        softDelete: 0
      });
    });
  }

  deleteOrderDetail(currentData): void {
    currentData.softDelete = 1;
  }

  returnOrderDetail(currentData): void {
    currentData.softDelete = 0;
  }

  private addToCart(product) {
    if (!product.quantity) {
      product.quantity = 0;
    }
    product.quantity++;
  }

  private removeFromCart(product) {
    if (product.quantity > 0) {
      product.quantity--;
    }
    if (product.quantity === 0) {
      this.prev(product);
      product.quantity = null;
    }
  }

  private next(product) {
    if (!(product.quantity)) {
      $('#eatMe' + product.id).carousel('next');
    }
    this.addToCart(product);
  }

  private prev(product) {
    $('#eatMe' + product.id).carousel('prev');
  }
}
