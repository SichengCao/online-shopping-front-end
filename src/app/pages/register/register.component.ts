import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    CommonModule, FormsModule, MatInputModule, MatButtonModule, MatCardModule,
    MatFormFieldModule, MatSnackBarModule, MatCheckboxModule,RouterModule
  ]
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  isSeller = false;  // 默认是普通用户 (Customer)
  loading = false;

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  register() {
    if (!this.username || !this.email || !this.password) {
      this.snackBar.open('Please fill in all fields', 'Close', { duration: 3000 });
      return;
    }

    this.loading = true;
    const userData = {
      username: this.username,
      email: this.email,
      password: this.password,
      isSeller: this.isSeller
    };

    console.log("发送的注册请求数据:", JSON.stringify(userData));

    this.authService.register(userData).subscribe(
      (response: string) => { // ✅ 解析 `text`
        console.log("注册成功:", response);
        this.snackBar.open(response, 'Close', { duration: 3000 }); // ✅ 显示返回的 `注册成功`
        this.router.navigate(['/login']); // 注册成功后跳转
      },
      (error) => {
        console.error("注册失败:", error);

        if (error.error && typeof error.error === 'string') {
          this.snackBar.open(error.error, 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('Registration failed! Try again.', 'Close', { duration: 3000 });
        }

        this.loading = false;
      }
    );
  }


}
