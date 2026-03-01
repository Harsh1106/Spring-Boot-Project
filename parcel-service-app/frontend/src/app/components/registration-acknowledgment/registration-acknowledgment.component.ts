import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-registration-acknowledgment',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './registration-acknowledgment.component.html',
  styleUrl: './registration-acknowledgment.component.css'
})
export class RegistrationAcknowledgmentComponent implements OnInit {
  username: string = '';
  name: string = '';
  email: string = '';
  customerId: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'] || 'N/A';
      this.name = params['name'] || 'N/A';
      this.email = params['email'] || 'N/A';
      this.customerId = params['customerId'] || 'N/A';
    });
  }
}
