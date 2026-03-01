import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DataService, Booking } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  bookingId: string = '';
  booking: Booking | null = null;
  errorMessage: string = '';
  isProcessing: boolean = false;
  
  paymentData = {
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'card'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private authService: AuthService
  ) {}

  showMessage(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  ngOnInit(): void {
    if (this.dataService.draftBooking) {
      this.booking = this.dataService.draftBooking as Booking;
      // Add a dummy booking ID for display purposes if needed, or leave blank
      if (!this.booking.bookingId) {
        this.booking.bookingId = 'DRAFT'; 
      }
    } else {
      // Fallback: Check if bookingId is in query params (legacy or reload support)
      // If not, redirect to home
      this.route.queryParams.subscribe(params => {
        this.bookingId = params['bookingId'];
        if (this.bookingId) {
          this.loadBooking();
        } else {
          // No draft and no ID - redirect
          this.errorMessage = 'No booking details found. Please create a booking first.';
          // Optional: redirect after delay
        }
      });
    }
  }

  loadBooking(): void {
    this.dataService.getBookingById(this.bookingId).subscribe({
      next: (booking) => {
        this.booking = booking;
        if (!this.booking) {
          this.errorMessage = 'Booking not found';
        }
      },
      error: (err) => {
        this.errorMessage = 'Error loading booking details';
        console.error(err);
      }
    });
  }

  validatePaymentForm(): boolean {
    // Basic validation
    if (this.paymentData.paymentMethod === 'card') {
      if (!this.paymentData.cardNumber || this.paymentData.cardNumber.length < 19) {
        this.errorMessage = 'Please enter a valid card number';
        return false;
      }
      if (!this.paymentData.cardHolderName) {
        this.errorMessage = 'Please enter card holder name';
        return false;
      }
      if (!this.paymentData.expiryDate || this.paymentData.expiryDate.length < 5) {
        this.errorMessage = 'Please enter expiry date';
        return false;
      }
      if (!this.paymentData.cvv || this.paymentData.cvv.length < 3) {
        this.errorMessage = 'Please enter valid CVV';
        return false;
      }
    }
    return true;
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s/g, '');
    if (value.length > 16) {
      value = value.substring(0, 16);
    }
    this.paymentData.cardNumber = value.replace(/(.{4})/g, '$1 ').trim();
  }

  formatExpiryDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.paymentData.expiryDate = value;
  }

  onSubmit(): void {
    if (this.validatePaymentForm()) {
      this.isProcessing = true;
      
      // Simulate payment processing (concept only, no actual gateway)
      setTimeout(() => {
        this.isProcessing = false;
        
        if (this.booking) {
          // Prepare the final booking object to be created
          // We use the draft booking data and add payment/status info
          
          // Remove bookingId if it is 'DRAFT' so backend generates a new one
          const { bookingId, ...bookingData } = this.booking;
          
          const finalBooking = {
            ...bookingData,
            parPaymentTime: this.paymentData.paymentMethod === 'card' ? new Date().toISOString() : '',
            parStatus: 'Booked' as const, // Must be one of the allowed literal types
            parPaymentMode: this.paymentData.paymentMethod === 'cash' ? 'COD' : 'Card'
          };

          // Call createBooking instead of updateBooking
          this.dataService.createBooking(finalBooking).subscribe({
            next: (createdBooking) => {
              // Navigate to invoice page with the NEW booking ID
              this.router.navigate(['/invoice'], {
                queryParams: { bookingId: createdBooking.bookingId }
              });
              // Clear draft
              this.dataService.draftBooking = null;
            },
            error: (err) => {
               this.errorMessage = 'Error processing booking';
               console.error(err);
            }
          });
        }
      }, 2000);
    }
  }

  cancelPayment(): void {
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
