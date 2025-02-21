import { Component, OnInit } from '@angular/core';
import { BookDto } from '../../booking.models';
import { GuesthouseService } from '../../core/services/guesthouse.service';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../navbar/navbar.component";

@Component({
  selector: 'app-user-booking',
  imports: [FormsModule, CommonModule, RouterLink, NavbarComponent],
  templateUrl: './user-booking.component.html',
  styleUrls: ['./user-booking.component.css']
})
export class UserBookingComponent implements OnInit {
  allBookings: BookDto[] = [];
  filteredBookings: BookDto[] = [];
  search: string = '';
  userId: string | null = null;

  constructor(
    private guestService: GuesthouseService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    console.log('🆔 User ID in component:', this.userId);

    if (!this.userId) {
      console.error('❌ No userId found! Redirecting to login...');
      this.router.navigate(['/login']);
      return;
    }

    this.getUserBookings(this.userId);
  }

  getUserBookings(id: string): void {
    this.guestService.getBookedUser(id).subscribe(
      (data) => {
        this.allBookings = data;
        this.filteredBookings = [...this.allBookings]; // Copy for filtering
      },
      (error) => {
        console.error('🚨 Error fetching bookings:', error);
      }
    );
  }

  trackById(index: number, item: BookDto): number {
    return item.id;
  }

  filterBookings(): void {
    this.filteredBookings = this.allBookings.filter((booking) =>
      booking.room?.name?.toLowerCase().includes(this.search.toLowerCase())
    );
  }
}
