import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Clear session when user navigates to homepage
    // This ensures that if user clicks back button or navigates to home,
    // they need to login again (for both customer and officer)
    if (this.authService.isAuthenticated()) {
      this.authService.clearSession();
    }
  }
}
