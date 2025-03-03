import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/pages/login/login.component';
import { RegisterComponent } from './app/pages/register/register.component';
import {SellerDashboardComponent} from './app/pages/seller-dashboard/seller-dashboard.component';
import {HomeComponent} from './app/pages/home/home.component';
import {ProductDetailsComponent} from './app/pages/product-details/product-details.component';
import {CartComponent} from './app/pages/cart/cart.component';
import {AuthGuard} from './app/guards/auth.guard';
import {OrderListComponent} from './app/components/order-list/order-list.component';
import {WatchlistComponent} from './app/components/watchlist/watchlist.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // 默认跳转到登录页
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'seller-dashboard', component: SellerDashboardComponent },
  { path: 'home', component: HomeComponent },
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent },
  { path: 'orders', component: OrderListComponent, providers: [] },
  { path: 'orders', component: OrderListComponent },
  { path: 'watchlist', component: WatchlistComponent },
  { path: 'seller-dashboard', component: SellerDashboardComponent },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
}).catch(err => console.error(err));
