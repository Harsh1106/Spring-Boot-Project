import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService, Booking } from '../../services/data.service';

@Component({
  selector: 'app-pickup-drop-update',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './pickup-drop-update.component.html',
  styleUrl: './pickup-drop-update.component.css'
})
export class PickupDropUpdateComponent implements OnInit {
  bookingId: string = '';
  booking: Booking | null = null;
  newPickupTime: string = '';
  newDropoffTime: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  get minPickupDateTime(): string {
    // Only next day allowed
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(10, 0, 0, 0); // 10 AM
    return this.formatDateTimeLocal(date);
  }

  get maxPickupDateTime(): string {
    // Allow pickup up to 30 days in advance
    const date = new Date();
    date.setDate(date.getDate() + 30);
    date.setHours(18, 0, 0, 0); // 6 PM
    return this.formatDateTimeLocal(date);
  }

  get minDropoffDateTime(): string {
    // Minimum 5 days after pickup date
    let baseDate = new Date();
    if (this.newPickupTime) {
      baseDate = new Date(this.newPickupTime);
    } else {
      // If no pickup selected yet, assume tomorrow as base
      baseDate.setDate(baseDate.getDate() + 1);
    }
    
    const date = new Date(baseDate);
    date.setDate(date.getDate() + 5);
    date.setHours(9, 0, 0, 0); // 9 AM
    return this.formatDateTimeLocal(date);
  }

  get maxDropoffDateTime(): string {
    // Dropoff up to 30 days after pickup (or today + 35 days if pickup not set)
    let baseDate = new Date();
    if (this.newPickupTime) {
      baseDate = new Date(this.newPickupTime);
    } else {
      baseDate.setDate(baseDate.getDate() + 1); // Default to tomorrow if not set
    }

    const date = new Date(baseDate);
    date.setDate(date.getDate() + 30);
    date.setHours(18, 0, 0, 0); // 6 PM
    return this.formatDateTimeLocal(date);
  }

  private formatDateTimeLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

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
    this.newPickupTime = '';
    this.newDropoffTime = '';

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
        this.newPickupTime = foundBooking.parPickupTime;
        this.newDropoffTime = foundBooking.parDropoffTime;
        this.showMessage('success', 'Booking details retrieved successfully');
      },
      error: (err) => {
        this.showMessage('error', 'Error finding booking');
        console.error(err);
      }
    });
  }

  updateTimes(): void {
    if (!this.booking) {
      this.showMessage('error', 'Please search for a booking first');
      return;
    }

    if (!this.newPickupTime || !this.newDropoffTime) {
      this.showMessage('error', 'Both pickup and dropoff times are required');
      return;
    }

    const bookingDate = new Date(this.booking.bookingDate);
    const pickupDate = new Date(this.newPickupTime);
    const dropDate = new Date(this.newDropoffTime);

    if (pickupDate <= bookingDate) {
      this.showMessage('error', 'Pickup time must be after the booking date/time.');
      return;
    }

    if (dropDate <= bookingDate) {
      this.showMessage('error', 'Drop-off time must be after the booking date/time.');
      return;
    }

    if (dropDate <= pickupDate) {
      this.showMessage('error', 'Drop-off time must be after the pickup time.');
      return;
    }

    // 5-day gap validation
    const pDate = new Date(pickupDate.getFullYear(), pickupDate.getMonth(), pickupDate.getDate());
    const dDate = new Date(dropDate.getFullYear(), dropDate.getMonth(), dropDate.getDate());
    const dayDiff = (dDate.getTime() - pDate.getTime()) / (1000 * 3600 * 24);

    if (dayDiff < 5) {
      this.showMessage('error', 'Dropoff date must be at least 5 days after pickup date');
      return;
    }

    this.dataService.updatePickupAndDrop(this.booking.bookingId, this.newPickupTime, this.newDropoffTime)
      .subscribe({
        next: (updated) => {
          if (updated) {
            this.showMessage('success', 'Pickup and dropoff times updated successfully');
            if (this.booking) {
              this.booking.parPickupTime = this.newPickupTime;
              this.booking.parDropoffTime = this.newDropoffTime;
            }
          } else {
            this.showMessage('error', 'Failed to update times');
          }
        },
        error: (err) => {
          this.showMessage('error', 'Failed to update times');
          console.error(err);
        }
      });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(' ', '-');
  }
}
