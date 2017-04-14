import { Router, NavigationExtras } from '@angular/router';
import { Product } from '../../product/product';
import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../invoice.service';
import { Customer } from '../../customer/customer';
import * as _ from 'underscore';
import { Invoice } from '../invoice';
import { ProductService } from '../../product/product.service';
import { AreaService } from '../../area/area.service';


@Component({
  selector: 'app-invoice-recent',
  templateUrl: './invoice-recent.component.html',
  styleUrls: ['./invoice-recent.component.css']
})
export class InvoiceRecentComponent implements OnInit {
  public currentDate: number = Date.now();
  public invoiceList: Invoice[] = [];
  public searchMode = 'username';
  constructor(private router:Router,private invoiceService: InvoiceService, private productService: ProductService, private areaService: AreaService) { }

  ngOnInit() {
    this.getRecentInvoice();
  }

  getRecentInvoice() {
    this.invoiceList = [];
    this.invoiceService.getRecentInvoice()
      .subscribe(
      (res: Customer[]) => {
        _.each(res, (customer: Customer) => {
          let tempInvoice: Invoice;
          // get area
          this.areaService.getAreaById(customer.area)
            .subscribe(
            (res) => {
              customer.areaData = res;
            }
            )

          //prepare invoice
          tempInvoice = {
            customerData: customer,
            payment_due_date: Date.now(),
            status: 'Due',
            discount: 0,
            invoice_created_date: Date.now(),
            total: 0,
            amount_due: 0
          }

          _.each(customer.productList, (item) => {
            this.productService.getProductById(item)
              .subscribe(
              (res: Product) => {
                tempInvoice.total = tempInvoice.total + res.rate;
                tempInvoice.amount_due = tempInvoice.total;
              },
              (err) => {

              }
              )
          });
          
          this.invoiceList.push(tempInvoice);
          // console.log(tempInvoice);
        });
      },
      (err) => {
        console.log(err);
      }
      )
  }

  //change search filter
  filterChange(event: any) {
    this.searchMode = event;
  }

  //quick search
  quickSerach(event: any) {
    console.log(event);
  }

  //edit invoice
  editInvoice(invoice:Invoice){
      let navextras: NavigationExtras={            
           queryParams:{"invoice":JSON.stringify(invoice)}
         };
    this.router.navigate(['/invoice/edit'],navextras);
  }

}
