import { Component, OnInit, AfterViewInit } from '@angular/core';

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

  constructor() {
    this.foodList = [
      {
        id: 1,
        name: 'Hamburguesa',
        price: 7,
        imgURL: './assets/img/hamburguer.jpg',
        type: 'eatMe'
      },
      {
        id: 2,
        name: 'Hamburguesa',
        price: 7,
        imgURL: './assets/img/hamburguer.jpg',
        type: 'eatMe'
      },
      {
        id: 3,
        name: 'Hamburguesa',
        price: 7,
        imgURL: './assets/img/hamburguer.jpg',
        type: 'eatMe'
      },
      {
        id: 4,
        name: 'Hamburguesa',
        price: 7,
        imgURL: './assets/img/hamburguer.jpg',
        type: 'eatMe'
      },
      {
        id: 5,
        name: 'Hamburguesa',
        price: 7,
        imgURL: './assets/img/hamburguer.jpg',
        type: 'eatMe'
      },
      {
        id: 6,
        name: 'Café',
        price: 20,
        imgURL: './assets/img/coffee3.jpg',
        type: 'drinkMe'
      },
      {
        id: 7,
        name: 'Café',
        price: 20,
        imgURL: './assets/img/coffee3.jpg',
        type: 'drinkMe'
      },
      {
        id: 8,
        name: 'Café',
        price: 20,
        imgURL: './assets/img/coffee3.jpg',
        type: 'drinkMe'
      },
      {
        id: 9,
        name: 'Café',
        price: 20,
        imgURL: './assets/img/coffee3.jpg',
        type: 'drinkMe'
      },
    ];

    this.eatMeList = this.foodList.filter(
      food => food.type === 'eatMe'
    );

    this.drinkMeList = this.foodList.filter(
      food => food.type === 'drinkMe'
    );

    this.pauseCarousel = false;
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
