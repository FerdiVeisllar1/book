import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports:[FormsModule,CommonModule,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  @Input() isAdmin: boolean = false;
  @Input() isLoggedIn: boolean = false;
  @Input() showButton: boolean = true;
  @Input() searchQuery: string = '';
  @Output() searchEvent = new EventEmitter<string>(); // ✅ Emit search queries to parent
  @Input() title: string = 'Manage Guesthouses'; // ✅ Dynamic title
  @Input() buttonText: string = 'New Guesthouse'; // ✅ Dynamic button text
  @Input() buttonLink: string = 'create'; // ✅ Dynamic button link
  userId: string | null = null;

  constructor(private authService:AuthService,private router:Router){}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    console.log('🆔 User ID in component:', this.userId);

    if (!this.userId) {
      console.error('❌ No userId found! Redirecting to login...');
      this.router.navigate(['/login']);  // Redirect if no userId
      return;
    }
  }

  onSearch() {
    this.searchEvent.emit(this.searchQuery); // ✅ Emit searchQuery on search
  }
}
