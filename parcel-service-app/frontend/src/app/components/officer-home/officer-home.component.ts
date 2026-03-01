import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-officer-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './officer-home.component.html',
  styleUrl: './officer-home.component.css'
})
export class OfficerHomeComponent implements OnInit {
  currentUser: any = null;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }
}
