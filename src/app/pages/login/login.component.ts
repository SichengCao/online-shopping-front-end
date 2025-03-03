import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatSnackBarModule,RouterModule]
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  login() {
    if (!this.username || !this.password) {
      this.snackBar.open('Please enter username and password', 'Close', { duration: 3000 });
      return;
    }

    this.loading = true;
    this.authService.login({ username: this.username, password: this.password }).subscribe(
      (response: { token: string; seller: boolean }) => {  //  明确 `response` 的类型
        console.log("🔥 后端返回的登录数据:", response);

        const token = response.token;  //  现在不会报错
        const isSeller = response.seller;  //  现在不会报错

        this.authService.saveUserData(token, isSeller);
        this.snackBar.open('Login successful!', 'Close', { duration: 3000 });

        if (isSeller) {
          this.router.navigate(['/seller-dashboard']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error => {
        console.error("login failed:", error);
        this.snackBar.open('Login failed! Check your credentials.', 'Close', { duration: 3000 });
        this.loading = false;
      }
    );

  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
