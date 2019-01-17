import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StripeService} from '../shared/services/stripe.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  userForm: FormGroup;
  emailExist = false;

  constructor(
    private formBuilder: FormBuilder,
    private stripeService: StripeService) {
  }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      email: [null, [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]],
      description: [null, [
        Validators.maxLength(300)
      ]],
      balance: [null, [
        Validators.required,
        Validators.pattern(/^-?(0|[1-9]\d*)?$/)
      ]]
    });
  }

  isValid(value) {
    const email = value.email;
    this.emailExist = false;

    this.stripeService.chekIfCustomerExist()
      .subscribe(res => {
        this.stripeService.customerList$.next(res.data);

        if (_.find(res.data, list => list.email === email)) {
          this.emailExist = true;
        } else {
          this.createCustomer(value);
        }
      });
  }

  private createCustomer(value): void {
    this.stripeService.createCustomer(value.email, value.balance, value.description)
      .subscribe();
  }
}
