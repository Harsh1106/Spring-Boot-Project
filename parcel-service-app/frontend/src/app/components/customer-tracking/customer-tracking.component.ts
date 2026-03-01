import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService, Booking } from '../../services/data.service';

@Component({
  selector: 'app-customer-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, RouterModule],
  templateUrl: './customer-tracking.component.html',
  styleUrl: './customer-tracking.component.css'
})
export class CustomerTrackingComponent implements OnInit {
  bookingId: string = '';
  booking: Booking | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
  }

  showMessage(type: 'success' | 'error', message: string): void {
    if (type === 'success') {
      this.successMessage = message;
      this.errorMessage = '';
    } else {
      this.errorMessage = message;
      this.successMessage = '';
    }
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  }

  searchBooking(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.booking = null;

    if (!this.bookingId) {
      this.showMessage('error', 'Please enter a booking ID');
      return;
    }

    this.dataService.getBookingById(this.bookingId).subscribe({
      next: (foundBooking) => {
        if (!foundBooking) {
          this.showMessage('error', 'Booking not found');
          return;
        }

        if (foundBooking.customerId !== this.currentUser.customerId) {
          this.showMessage('error', 'You can only track your own bookings');
          return;
        }

        this.booking = foundBooking;
        this.showMessage('success', 'Booking details retrieved successfully');
      },
      error: (err) => {
        this.showMessage('error', 'Error finding booking');
        console.error(err);
      }
    });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(' ', '-');
  }

  canViewInvoice(booking: Booking): boolean {
    // Check if invoice can be viewed (payment must be completed)
    return booking.parStatus !== 'Pending Payment' && 
           booking.parPaymentTime !== null && 
           booking.parPaymentTime !== undefined && 
           booking.parPaymentTime.trim() !== '';
  }

  viewInvoice(bookingId: string): void {
    this.dataService.getBookingById(bookingId).subscribe(booking => {
      // Only allow viewing invoice if payment is completed
      if (booking && booking.parStatus !== 'Pending Payment' && booking.parPaymentTime && booking.parPaymentTime.trim() !== '') {
        this.router.navigate(['/invoice'], { queryParams: { bookingId } });
      } else {
        alert('Invoice cannot be generated. Payment is still pending. Please complete the payment first.');
      }
    });
  }
}
