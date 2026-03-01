import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  currentUser: any = null;
  isCustomer = false;
  isOfficer = false;
  currentRoute: string = '';
  private routerSubscription?: Subscription;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateAuthStatus();
    this.updateCurrentRoute();
    
    // Subscribe to route changes to update auth status
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateAuthStatus();
      this.updateCurrentRoute();
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  updateAuthStatus(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.currentUser = this.authService.getCurrentUser();
    this.isCustomer = this.authService.isCustomer();
    this.isOfficer = this.authService.isOfficer();
  }

  updateCurrentRoute(): void {
    this.currentRoute = this.router.url;
  }

  shouldShowNavLinks(): boolean {
    const routesWithoutNavLinks = ['/homepage', '/login', '/registration', '/registration-acknowledgment'];
    return !routesWithoutNavLinks.includes(this.currentRoute);
  }

  logout(): void {
    this.authService.logout();
    this.updateAuthStatus();
  }
}
