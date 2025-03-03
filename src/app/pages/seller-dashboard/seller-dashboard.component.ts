import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SellerService } from '../../services/seller.service';
import { Router } from '@angular/router';

interface Order {
  id: number;
  customer: string;
  status: string;
}

interface Product {
  id: number;
  name: string;
  retailPrice: number;
  quantity: number;
}

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.css']
})
export class SellerDashboardComponent implements OnInit {
  orders: Order[] = [];
  products: Product[] = [];
  displayedColumns: string[] = ['id', 'customer', 'status', 'actions'];
  productColumns: string[] = ['name', 'price', 'stock', 'actions'];
  mostProfitableProduct: string = '';
  topSellingProduct: string = '';
  loading: boolean = true; // To show loading spinner while fetching data

  constructor(private sellerService: SellerService, private router: Router) {}

  ngOnInit(): void {
    this.fetchOrders();
    this.fetchProducts();
    this.fetchStatistics();
  }

  fetchOrders(): void {
    this.sellerService.getOrders().subscribe(
      (data: Order[]) => {
        this.orders = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching orders:', error);
        this.loading = false;
      }
    );
  }

  fetchProducts(): void {
    this.sellerService.getProducts().subscribe(
      (data: Product[]) => this.products = data,
      (error) => console.error('Error fetching products:', error)
    );
  }

  fetchStatistics(): void {
    this.sellerService.getMostProfitableProduct().subscribe(
      (data: any) => this.mostProfitableProduct = data.name || 'N/A',
      (error) => console.error('Error fetching most profitable product:', error)
    );

    this.sellerService.getTopSellingProduct().subscribe(
      (data: any) => this.topSellingProduct = data.name || 'N/A',
      (error) => console.error('Error fetching top-selling product:', error)
    );
  }

  viewOrder(orderId: number): void {
    console.log(`View order ${orderId}`);
  }

  completeOrder(orderId: number): void {
    this.sellerService.completeOrder(orderId).subscribe(
      () => this.fetchOrders(),
      (error) => console.error('Error completing order:', error)
    );
  }

  cancelOrder(orderId: number): void {
    this.sellerService.cancelOrder(orderId).subscribe(
      () => this.fetchOrders(),
      (error) => console.error('Error canceling order:', error)
    );
  }

  addProduct(): void {
    this.router.navigate(['/add-product']); // Adjust based on routing structure
  }

  editProduct(productId: number): void {
    this.router.navigate([`/edit-product/${productId}`]);
  }

  deleteProduct(productId: number): void {
    this.sellerService.deleteProduct(productId).subscribe(
      () => this.fetchProducts(),
      (error) => console.error('Error deleting product:', error)
    );
  }
}
