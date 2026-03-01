import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact-support',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './contact-support.component.html',
  styleUrl: './contact-support.component.css'
})
export class ContactSupportComponent {
  // Static contact information component
}
