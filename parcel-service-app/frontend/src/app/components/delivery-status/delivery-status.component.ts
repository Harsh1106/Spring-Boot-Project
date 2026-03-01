import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService, Booking } from '../../services/data.service';

@Component({
  selector: 'app-delivery-status',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './delivery-status.component.html',
  styleUrl: './delivery-status.component.css'
})
export class DeliveryStatusComponent implements OnInit {
  bookingId: string = '';
  booking: Booking | null = null;
  newStatus: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  statusOptions = ['Booked', 'In Transit', 'Delivered', 'Returned'];

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isOfficer()) {
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
    this.newStatus = '';

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

        this.booking = foundBooking;
        this.newStatus = foundBooking.parStatus;
        this.showMessage('success', 'Booking details retrieved successfully');
      },
      error: (err) => {
        this.showMessage('error', 'Error finding booking');
        console.error(err);
      }
    });
  }

  getStatusPriority(status: string): number {
    switch (status.toLowerCase()) {
      case 'pending payment': return 0;
      case 'booked': return 1;
      case 'in transit': return 2;
      case 'delivered': return 3;
      case 'returned': return 4;
      default: return -1;
    }
  }

  updateStatus(): void {
    if (!this.booking) {
      this.showMessage('error', 'Please search for a booking first');
      return;
    }

    if (!this.newStatus) {
      this.showMessage('error', 'Please select a status');
      return;
    }

    const currentPriority = this.getStatusPriority(this.booking.parStatus);
    const newPriority = this.getStatusPriority(this.newStatus);

    if (newPriority < currentPriority) {
      this.showMessage('error', `Cannot revert status from ${this.booking.parStatus} to ${this.newStatus}`);
      return;
    }

    this.dataService.updateDeliveryStatus(this.booking.bookingId, this.newStatus).subscribe({
      next: (updated) => {
        if (updated) {
          this.showMessage('success', 'Delivery status updated successfully');
          if (this.booking) {
            this.booking.parStatus = this.newStatus as any;
          }
        } else {
          this.showMessage('error', 'Failed to update status');
        }
      },
      error: (err) => {
        this.showMessage('error', 'Failed to update status');
        console.error(err);
      }
    });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(' ', '-');
  }
}
