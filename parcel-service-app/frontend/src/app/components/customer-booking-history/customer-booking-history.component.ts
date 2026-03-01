import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService, Booking, Page } from '../../services/data.service';

@Component({
  selector: 'app-customer-booking-history',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule],
  templateUrl: './customer-booking-history.component.html',
  styleUrl: './customer-booking-history.component.css'
})
export class CustomerBookingHistoryComponent implements OnInit {
  bookings: Booking[] = [];
  currentUser: any = null;
  
  // Pagination
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  totalElements: number = 0;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadBookings();
  }

  loadBookings(): void {
    if (this.currentUser?.customerId) {
      this.dataService.getBookingsByCustomerId(this.currentUser.customerId, this.currentPage, this.pageSize).subscribe({
        next: (page: Page<Booking>) => {
          this.bookings = page.content;
          this.totalPages = page.totalPages;
          this.totalElements = page.totalElements;
        },
        error: (err) => {
          console.error('Error loading bookings', err);
          this.bookings = [];
        }
      });
    }
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadBookings();
    }
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(' ', '-');
  }

  viewInvoice(bookingId: string): void {
    this.dataService.getBookingById(bookingId).subscribe(booking => {
      if (!booking) return;
      
      const isCOD = booking.parPaymentMode === 'COD';
      const isPaid = booking.parStatus !== 'Pending Payment' && 
                     booking.parPaymentTime && 
                     booking.parPaymentTime.trim() !== '';

      if (isCOD || isPaid) {
        this.router.navigate(['/invoice'], { queryParams: { bookingId } });
      } else {
        alert('Invoice cannot be generated. Payment is still pending. Please complete the payment first.');
      }
    });
  }

  canViewInvoice(booking: Booking): boolean {
    if (booking.parPaymentMode === 'COD') {
      return true;
    }
    // Check if invoice can be viewed (payment must be completed)
    return booking.parStatus !== 'Pending Payment' && 
           booking.parPaymentTime !== null && 
           booking.parPaymentTime !== undefined && 
           booking.parPaymentTime.trim() !== '';
  }
}
