import { Component, OnInit } from '@angular/core';
import { StripeService } from '../shared/services/stripe.service';
import { ICustomerList } from '../shared/models/stripe.interface';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['email', 'description', 'balance', 'date'];
  customerList: MatTableDataSource<ICustomerList>;

  constructor(private stripeService: StripeService) {
  }

  ngOnInit(): void {
    this.stripeService.getCustomerList()
      .subscribe(res => {
        this.stripeService.customerList$.next(res.data);
        this.customerList = this.getMatTableDataSource(res.data);
      });
  }

  applyFilter(filterValue: string) {
    if (!filterValue) {
      this.customerList.filter = '';
    } else {
      const chosenDate = new Date(filterValue);
      this.customerList.filter = `${chosenDate.getDate()}/${chosenDate.getMonth() + 1}/${chosenDate.getFullYear()}`;
    }
  }

  private getMatTableDataSource(res): MatTableDataSource<ICustomerList> {
    return new MatTableDataSource(res.map(item => {
      const itemDate = new Date(item.created * 1000);
      item.created = `${itemDate.getDate()}/${itemDate.getMonth() + 1}/${itemDate.getFullYear()}`;

      return item;
    }));
  }
}
