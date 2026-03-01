import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  formData = {
    customerName: '',
    email: '',
    countryCode: '+1',
    mobile: '',
    address: '',
    pincode: '',
    password: '',
    confirmPassword: '',
    preferences: {
      mailDelivery: false,
      notifications: false,
      other: ''
    }
  };

  errors: any = {};
  countryCodes = ['+1', '+44', '+91', '+86', '+81', '+49', '+33', '+39', '+34', '+7'];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  validateForm(): boolean {
    this.errors = {};

    if (!this.formData.customerName || this.formData.customerName.length > 50) {
      this.errors.customerName = 'Customer name is required (max 50 characters)';
    }

    if (!this.formData.email || !this.isValidEmail(this.formData.email)) {
      this.errors.email = 'Valid email is required';
    }

    if (!this.formData.mobile || !/^\d{10}$/.test(this.formData.mobile)) {
      this.errors.mobile = '10 digit mobile number is required';
    }

    if (!this.formData.address) {
      this.errors.address = 'Address is required';
    }

    if (!this.formData.pincode || !/^\d{6}$/.test(this.formData.pincode)) {
      this.errors.pincode = 'Valid 6 digit PIN code is required';
    }

    if (!this.formData.password || this.formData.password.length < 5 || this.formData.password.length > 30 || !this.isValidPassword(this.formData.password)) {
      this.errors.password = 'Password must be 5-30 characters with at least one uppercase, lowercase, and special character';
    }

    if (this.formData.password !== this.formData.confirmPassword) {
      this.errors.confirmPassword = 'Passwords do not match';
    }

    return Object.keys(this.errors).length === 0;
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isValidPassword(password: string): boolean {
    return /(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password);
  }

  onSubmit(): void {
    if (this.validateForm()) {
      // Username is now handled by backend (set to customerId)
      
      const user: User = {
        username: '', // Backend will generate userId/customerId
        password: this.formData.password,
        role: 'customer',
        name: this.formData.customerName,
        email: this.formData.email,
        mobile: `${this.formData.countryCode}-${this.formData.mobile}`,
        address: this.formData.address,
        pincode: this.formData.pincode
      };

      this.authService.register(user).subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/registration-acknowledgment'], {
              queryParams: {
                username: response.username, // Should be same as customerId now
                name: user.name,
                email: user.email,
                customerId: response.customerId
              }
            });
          } else {
             // Should not happen if success is true, but just in case
             this.errors.email = 'Registration failed. Please try again.';
          }
        },
        error: (err) => {
          this.errors.email = 'Email or Username already exists. Please use a different email.';
        }
      });
    }
  }

  resetForm(): void {
    this.formData = {
      customerName: '',
      email: '',
      countryCode: '+1',
      mobile: '',
      address: '',
      pincode: '',
      password: '',
      confirmPassword: '',
      preferences: {
        mailDelivery: false,
        notifications: false,
        other: ''
      }
    };
    this.errors = {};
  }
}
