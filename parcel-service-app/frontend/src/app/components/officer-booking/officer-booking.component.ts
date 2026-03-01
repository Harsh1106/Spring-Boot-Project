import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-officer-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './officer-booking.component.html',
  styleUrl: './officer-booking.component.css'
})
export class OfficerBookingComponent implements OnInit {
  formData = {
    customerId: '',
    customerName: '',
    customerAddress: '',
    customerPin: '',
    customerMobile: '',
    recName: '',
    recAddress: '',
    recPin: '',
    recMobile: '',
    parWeightGram: null as number | null,
    parContentsDescription: '',
    parDeliveryType: 'Standard',
    parPackingPreference: 'Standard',
    parPickupTime: '',
    parDropoffTime: ''
  };

  calculatedCost: number = 0;
  successMessage: string = '';
  errorMessage: string = '';

  deliveryTypes = ['Standard', 'Express', 'Economy'];
  packingPreferences = ['Standard', 'Premium', 'Basic'];

  get currentDateTime(): string {
    return new Date().toLocaleString();
  }

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
    if (this.formData.parPickupTime) {
      baseDate = new Date(this.formData.parPickupTime);
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
    if (this.formData.parPickupTime) {
      baseDate = new Date(this.formData.parPickupTime);
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
    // Customer information must be entered manually by officer
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

  calculateCost(): void {
    if (this.formData.parWeightGram && this.formData.parDeliveryType && this.formData.parPackingPreference) {
      this.calculatedCost = this.dataService.calculateServiceCost(
        this.formData.parWeightGram,
        this.formData.parDeliveryType,
        this.formData.parPackingPreference
      );
    }
  }

  validateForm(): boolean {
    this.errorMessage = '';

    if (!this.formData.customerName) {
      this.showMessage('error', 'Customer name is required');
      return false;
    }
    if (!this.formData.customerAddress) {
      this.showMessage('error', 'Customer address is required');
      return false;
    }
    if (!this.formData.customerMobile || !/^\d{10}$/.test(this.formData.customerMobile)) {
      this.showMessage('error', 'Valid 10-digit customer mobile number is required');
      return false;
    }
    if (!this.formData.recName) {
      this.showMessage('error', 'Receiver name is required');
      return false;
    }
    if (!this.formData.recAddress) {
      this.showMessage('error', 'Receiver address is required');
      return false;
    }
    if (!this.formData.recPin || !/^\d{6}$/.test(this.formData.recPin)) {
      this.showMessage('error', 'Valid PIN code is required (6 digits)');
      return false;
    }
    if (!this.formData.recMobile || !/^\d{10}$/.test(this.formData.recMobile)) {
      this.showMessage('error', 'Valid 10-digit receiver mobile number is required');
      return false;
    }
    if (!this.formData.parWeightGram || this.formData.parWeightGram <= 0) {
      this.showMessage('error', 'Valid parcel weight is required');
      return false;
    }
    if (!this.formData.parContentsDescription) {
      this.showMessage('error', 'Parcel contents description is required');
      return false;
    }
    if (!this.formData.parPickupTime) {
      this.showMessage('error', 'Pickup time is required');
      return false;
    }
    
    // Validate pickup time
    const pickupDate = new Date(this.formData.parPickupTime);
    const minPickup = new Date();
    minPickup.setDate(minPickup.getDate() + 1);
    minPickup.setHours(0, 0, 0, 0);
    
    if (pickupDate < minPickup) {
      this.showMessage('error', 'Pickup time must be tomorrow or later');
      return false;
    }

    const pickupHour = pickupDate.getHours();
    if (pickupHour < 9 || pickupHour >= 18) {
      this.showMessage('error', 'Pickup time must be between 9 AM and 6 PM');
      return false;
    }

    if (!this.formData.parDropoffTime) {
      this.showMessage('error', 'Dropoff time is required');
      return false;
    }

    // Validate dropoff time
    const dropoffDate = new Date(this.formData.parDropoffTime);
    
    // Compare dates only (ignoring time) to check the "5 days later" rule
    const pickupDay = new Date(pickupDate.getFullYear(), pickupDate.getMonth(), pickupDate.getDate());
    const dropoffDay = new Date(dropoffDate.getFullYear(), dropoffDate.getMonth(), dropoffDate.getDate());
    const dayDiff = (dropoffDay.getTime() - pickupDay.getTime()) / (1000 * 3600 * 24);

    if (dayDiff < 5) {
      this.showMessage('error', 'Dropoff date must be at least 5 days after pickup date');
      return false;
    }

    const dropoffHour = dropoffDate.getHours();
    if (dropoffHour < 9 || dropoffHour >= 18) {
      this.showMessage('error', 'Dropoff time must be between 9 AM and 6 PM');
      return false;
    }

    if (dropoffDate <= pickupDate) {
      this.showMessage('error', 'Dropoff time must be after pickup time');
      return false;
    }

    return true;
  }

  onSubmit(): void {
    if (this.validateForm()) {
      // Create draft booking object
      const draftBooking = {
        customerId: this.formData.customerId || 'OFFICER_' + Date.now(),
        customerName: this.formData.customerName,
        customerAddress: this.formData.customerAddress,
        customerPin: this.formData.customerPin,
        customerMobile: this.formData.customerMobile,
        recName: this.formData.recName,
        recAddress: this.formData.recAddress,
        recPin: this.formData.recPin,
        recMobile: this.formData.recMobile,
        parWeightGram: this.formData.parWeightGram!,
        parContentsDescription: this.formData.parContentsDescription,
        parDeliveryType: this.formData.parDeliveryType,
        parPackingPreference: this.formData.parPackingPreference,
        parPickupTime: this.formData.parPickupTime,
        parDropoffTime: this.formData.parDropoffTime,
        parServiceCost: this.calculatedCost,
        parPaymentTime: '', // Will be set after payment
        parStatus: 'Pending Payment' as const
      };

      // Store in DataService
      this.dataService.draftBooking = draftBooking;

      // Navigate to payment page
      this.router.navigate(['/payment']);
    }
  }
}
