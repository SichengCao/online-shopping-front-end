import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule]
})
export class HomeComponent implements OnInit {
  products: any[] = []; // 存储商品列表

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.http.get<any[]>('http://localhost:8081/products/all').subscribe(
      data => {
        console.log("🔥 加载的商品:", data);
        this.products = data;
      },
      error => {
        console.error("❌ 加载商品失败:", error);
      }
    );
  }

  viewProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }
}
