import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService, Booking, Page } from '../../services/data.service';

@Component({
  selector: 'app-officer-booking-history',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, RouterModule],
  templateUrl: './officer-booking-history.component.html',
  styleUrl: './officer-booking-history.component.css'
})
export class OfficerBookingHistoryComponent implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  currentUser: any = null;
  searchDate: string = '';
  searchBookingId: string = '';
  errorMessage: string = '';
  successMessage: string = '';

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
    if (!this.currentUser || this.currentUser.role !== 'officer') {
      this.router.navigate(['/login']);
      return;
    }

    this.loadBookings();
  }

  loadBookings(): void {
    this.dataService.getAllBookings(this.currentPage, this.pageSize).subscribe({
      next: (page: Page<Booking>) => {
        this.bookings = page.content;
        this.totalPages = page.totalPages;
        this.totalElements = page.totalElements;
        this.filterBookings(); // Apply filters to the current page
      },
      error: (err) => {
        console.error('Error loading bookings', err);
        this.bookings = [];
        this.filteredBookings = [];
      }
    });
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadBookings();
    }
  }

  filterBookings(): void {
    this.filteredBookings = this.bookings.filter(booking => {
      const matchDate = !this.searchDate || (booking.bookingDate && new Date(booking.bookingDate).toISOString().slice(0, 10) === this.searchDate);
      const matchId = !this.searchBookingId || booking.bookingId.toLowerCase().includes(this.searchBookingId.toLowerCase());
      return matchDate && matchId;
    });

    if (this.searchBookingId && this.filteredBookings.length > 0) {
      this.showMessage('success', 'Booking details retrieved successfully');
    } else if (this.searchBookingId && this.filteredBookings.length === 0) {
      this.showMessage('error', 'Booking not found');
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

  clearFilters(): void {
    this.searchDate = '';
    this.searchBookingId = '';
    this.filterBookings();
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
