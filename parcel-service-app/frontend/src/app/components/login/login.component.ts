import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  role: 'customer' | 'officer' = 'customer';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Clear session whenever login page is loaded
    this.authService.clearSession();
  }

  showMessage(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  validateForm(): boolean {
    this.errorMessage = '';

    if (!this.username || this.username.trim() === '') {
      this.showMessage(`${this.role === 'officer' ? 'Officer ID' : 'Customer ID'} is required`);
      return false;
    }

    if (!this.password || this.password.trim() === '') {
      this.showMessage('Password is required');
      return false;
    }

    if (!this.role) {
      this.showMessage('Please select a role');
      return false;
    }

    return true;
  }

  onSubmit(): void {
    if (this.validateForm()) {
      this.isLoading = true;
      this.authService.login(this.username, this.password).subscribe({
        next: (user) => {
          if (user) {
            // Check if the logged-in user's role matches the selected role
            if (user.role === this.role) {
              if (user.role === 'customer') {
                this.router.navigate(['/customer-home']);
              } else if (user.role === 'officer') {
                this.router.navigate(['/officer-home']);
              }
            } else {
              this.showMessage(`Invalid credentials for ${this.role} role. Please check your ${this.role === 'officer' ? 'Officer ID' : 'Customer ID'} and password.`);
              this.isLoading = false;
            }
          } else {
            this.showMessage(`Invalid ${this.role === 'officer' ? 'Officer ID' : 'Customer ID'} or password`);
            this.isLoading = false;
          }
        },
        error: (err) => {
          this.showMessage('An error occurred during login');
          this.isLoading = false;
        }
      });
    }
  }
}
