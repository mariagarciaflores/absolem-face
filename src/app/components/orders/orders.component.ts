import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { OrderService } from '../../services/order.service';
import { Observable } from 'rxjs/Observable';

declare const $: any;
@Component({
  selector: 'aps-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orders: Array<any>;
  currentOrderDetail: any = {};
  orderDetailsToEdit: Array<any> = [];
  private itemsCollection: AngularFirestoreCollection<any>;
  items: Observable<any[]>;

  constructor(private orderService: OrderService, private afs: AngularFirestore) {
    this.itemsCollection = afs.collection<any>('batches');
    this.items = this.itemsCollection.valueChanges();
    this.items.subscribe(batch => {
      // console.log(batch);
    });
    var filtered = afs.collection('batches', ref => ref.where('state', '==', 'open')).valueChanges();
    filtered.subscribe(batch => {
      console.log(batch);
    });
    this.fillOrders();
  }

  ngOnInit() {
    $('#active-orders-box').boxWidget('toggle');
    $('#payed-orders-box').boxWidget('toggle');
  }

  fillOrders(): void {
    this.orderService.getOrders().subscribe(
      (response) => {
        this.orders = response;
      },
      error => {

      }
    );

  }

  getOrderDetail(orderId, orderName, orderNumber): void {
    this.currentOrderDetail = {};
    this.currentOrderDetail.orderName = orderName;
    this.currentOrderDetail.orderNumber = orderNumber;
    var orderDetails = this.orderService.getOrderDetail(orderId);
    this.currentOrderDetail.details = orderDetails;
  }

  addEditableOrderDetail(): void {
    this.orderDetailsToEdit = this.currentOrderDetail.details.map(d => Object.assign({}, d));
    console.log(this.orderDetailsToEdit);
    console.log(this.currentOrderDetail.details);
  }

  deleteOrderDetail(currentData): void {
    currentData.softDelete = 1;
  }

  returnOrderDetail(currentData): void {
    currentData.softDelete = 0;
  }

  updateOrderDetail(): void {
    this.orderDetailsToEdit.forEach((current) => {
      current.totalPrice = current.amount * current.unitPrice;
    });
    this.currentOrderDetail.details = this.orderDetailsToEdit;
  }
}

