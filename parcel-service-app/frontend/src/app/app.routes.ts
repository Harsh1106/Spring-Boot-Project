import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/homepage',
    pathMatch: 'full'
  },
  {
    path: 'homepage',
    loadComponent: () => import('./components/homepage/homepage.component').then(m => m.HomepageComponent)
  },
  {
    path: 'registration',
    loadComponent: () => import('./components/registration/registration.component').then(m => m.RegistrationComponent)
  },
  {
    path: 'registration-acknowledgment',
    loadComponent: () => import('./components/registration-acknowledgment/registration-acknowledgment.component').then(m => m.RegistrationAcknowledgmentComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'customer-home',
    loadComponent: () => import('./components/customer-home/customer-home.component').then(m => m.CustomerHomeComponent),
    canActivate: [authGuard],
    data: { role: 'customer' }
  },
  {
    path: 'officer-home',
    loadComponent: () => import('./components/officer-home/officer-home.component').then(m => m.OfficerHomeComponent),
    canActivate: [authGuard],
    data: { role: 'officer' }
  },
  {
    path: 'customer-booking',
    loadComponent: () => import('./components/customer-booking/customer-booking.component').then(m => m.CustomerBookingComponent),
    canActivate: [authGuard],
    data: { role: 'customer' }
  },
  {
    path: 'officer-booking',
    loadComponent: () => import('./components/officer-booking/officer-booking.component').then(m => m.OfficerBookingComponent),
    canActivate: [authGuard],
    data: { role: 'officer' }
  },
  {
    path: 'payment',
    loadComponent: () => import('./components/payment/payment.component').then(m => m.PaymentComponent),
    canActivate: [authGuard]
  },
  {
    path: 'invoice',
    loadComponent: () => import('./components/invoice/invoice.component').then(m => m.InvoiceComponent),
    canActivate: [authGuard]
  },
  {
    path: 'customer-tracking',
    loadComponent: () => import('./components/customer-tracking/customer-tracking.component').then(m => m.CustomerTrackingComponent),
    canActivate: [authGuard],
    data: { role: 'customer' }
  },
  {
    path: 'officer-tracking',
    loadComponent: () => import('./components/officer-tracking/officer-tracking.component').then(m => m.OfficerTrackingComponent),
    canActivate: [authGuard],
    data: { role: 'officer' }
  },
  {
    path: 'pickup-drop-update',
    loadComponent: () => import('./components/pickup-drop-update/pickup-drop-update.component').then(m => m.PickupDropUpdateComponent),
    canActivate: [authGuard],
    data: { role: 'officer' }
  },
  {
    path: 'delivery-status',
    loadComponent: () => import('./components/delivery-status/delivery-status.component').then(m => m.DeliveryStatusComponent),
    canActivate: [authGuard],
    data: { role: 'officer' }
  },
  {
    path: 'customer-booking-history',
    loadComponent: () => import('./components/customer-booking-history/customer-booking-history.component').then(m => m.CustomerBookingHistoryComponent),
    canActivate: [authGuard],
    data: { role: 'customer' }
  },
  {
    path: 'officer-booking-history',
    loadComponent: () => import('./components/officer-booking-history/officer-booking-history.component').then(m => m.OfficerBookingHistoryComponent),
    canActivate: [authGuard],
    data: { role: 'officer' }
  },
  {
    path: 'contact-support',
    loadComponent: () => import('./components/contact-support/contact-support.component').then(m => m.ContactSupportComponent),
    canActivate: [authGuard],
    data: { role: 'customer' }
  },
  {
    path: '**',
    redirectTo: '/homepage'
  }
];
