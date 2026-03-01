import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService, Booking } from '../../services/data.service';

@Component({
  selector: 'app-officer-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './officer-tracking.component.html',
  styleUrl: './officer-tracking.component.css'
})
export class OfficerTrackingComponent implements OnInit {
  bookingId: string = '';
  booking: Booking | null = null;
  errorMessage: string = '';
  successMessage: string = '';

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
}
