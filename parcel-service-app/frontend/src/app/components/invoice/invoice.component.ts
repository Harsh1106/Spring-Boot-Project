import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DataService, Booking } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent implements OnInit {
  bookingId: string = '';
  booking: Booking | null = null;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.bookingId = params['bookingId'] || '';
      if (this.bookingId) {
        this.loadInvoice();
      }
    });
  }

  showMessage(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  loadInvoice(): void {
    this.dataService.getBookingById(this.bookingId).subscribe({
      next: (booking) => {
        this.booking = booking;
        if (!this.booking) {
          this.showMessage('Booking not found');
          return;
        }
        
        // Check if payment is pending - invoice should not be generated for pending payments
        // For COD, status starts as Booked/Pending, but invoice is allowed.
        // We only block if it is NOT COD and Payment Time is missing.
        
        const isCOD = this.booking.parPaymentMode === 'COD';

        if (!isCOD && (!this.booking.parPaymentTime || this.booking.parPaymentTime.trim() === '')) {
           this.showMessage('Invoice cannot be generated. Payment record is incomplete.');
           this.booking = null;
           return;
        }
      },
      error: (err) => {
        this.showMessage('Error loading invoice');
        console.error(err);
      }
    });
  }

  printInvoice(): void {
    window.print();
  }

  goBack(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.role === 'customer') {
      this.router.navigate(['/customer-booking-history']);
    } else if (currentUser?.role === 'officer') {
      this.router.navigate(['/officer-booking-history']);
    } else {
      this.router.navigate(['/homepage']);
    }
  }
}
