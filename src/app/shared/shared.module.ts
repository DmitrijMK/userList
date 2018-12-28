import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StripeService } from './services/stripe.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [StripeService]
})
export class SharedModule { }
