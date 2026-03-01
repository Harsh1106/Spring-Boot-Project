import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError } from 'rxjs';

export interface Booking {
  bookingId: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
  customerPin: string;
  customerMobile: string;
  recName: string;
  recAddress: string;
  recPin: string;
  recMobile: string;
  parWeightGram: number;
  parContentsDescription: string;
  parDeliveryType: string;
  parPackingPreference: string;
  parPickupTime: string;
  parDropoffTime: string;
  parServiceCost: number;
  parPaymentTime: string;
  parPaymentMode?: string;
  parStatus: 'Pending Payment' | 'Booked' | 'In Transit' | 'Delivered' | 'Returned';
  bookingDate: string;
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly BOOKING_URL = 'http://localhost:8082';
  private readonly TRACKING_URL = 'http://localhost:8083';
  private readonly HISTORY_URL = 'http://localhost:8084';
  private readonly PICKUP_URL = 'http://localhost:8085';
  private readonly STATUS_URL = 'http://localhost:8086';

  // Shared booking data for passing between components
  public draftBooking: Partial<Booking> | null = null;

  constructor(private http: HttpClient) { }

  createBooking(booking: Omit<Booking, 'bookingId' | 'bookingDate'>): Observable<Booking> {
    return this.http.post<Booking>(`${this.BOOKING_URL}/viewbookService`, booking);
  }

  getBookingById(bookingId: string): Observable<Booking | null> {
    return this.http.get<Booking>(`${this.TRACKING_URL}/trackParcelStatus/${bookingId}`).pipe(
      catchError(() => of(null))
    );
  }

  getBookingsByCustomerId(customerId: string, page: number = 0, size: number = 10): Observable<Page<Booking>> {
    return this.http.get<Page<Booking>>(`${this.HISTORY_URL}/bookings/customer/${customerId}?page=${page}&size=${size}`).pipe(
      catchError(() => of({ content: [], totalPages: 0, totalElements: 0, size, number: page }))
    );
  }

  getAllBookings(page: number = 0, size: number = 10): Observable<Page<Booking>> {
    return this.http.get<Page<Booking>>(`${this.BOOKING_URL}/viewbookService?page=${page}&size=${size}`).pipe(
      catchError(() => of({ content: [], totalPages: 0, totalElements: 0, size, number: page }))
    );
  }

  getBookingsByDate(date: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.HISTORY_URL}/viewBookingHistory?date=${date}`).pipe(
      catchError(() => of([]))
    );
  }

  updateBooking(bookingId: string, updates: Partial<Booking>): Observable<boolean> {
    // This is on Booking Service (8082)
    return this.http.patch(`${this.BOOKING_URL}/bookings/${bookingId}`, updates).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  updatePickupAndDrop(bookingId: string, pickupTime: string, dropTime: string): Observable<boolean> {
    return this.http.put(`${this.PICKUP_URL}/updatepickupanddrop/${bookingId}`, { pickupTime, dropTime }).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error updating pickup/drop:', error);
        return of(false);
      })
    );
  }

  updateDeliveryStatus(bookingId: string, status: string): Observable<boolean> {
    return this.http.put(`${this.STATUS_URL}/updateDeliveryStatus/${bookingId}`, { status }).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error updating delivery status:', error);
        return of(false);
      })
    );
  }

  calculateServiceCost(
    weight: number,
    deliveryType: string,
    packingPreference: string
  ): number {
    let cost = 0;
    
    // Base cost by weight
    if (weight <= 500) {
      cost = 50;
    } else if (weight <= 1000) {
      cost = 100;
    } else if (weight <= 2000) {
      cost = 150;
    } else {
      cost = 200 + ((weight - 2000) / 1000) * 50;
    }

    // Delivery type multiplier
    if (deliveryType === 'Express') {
      cost += cost * 0.5; // Fixed calculation (cost * 1.5)
    } else if (deliveryType === 'Standard') {
      cost *= 1.0;
    } else if (deliveryType === 'Economy') {
      cost *= 0.8;
    }

    // Packing preference cost
    if (packingPreference === 'Premium') {
      cost += 50;
    } else if (packingPreference === 'Standard') {
      cost += 25;
    }

    return Math.round(cost);
  }
}
