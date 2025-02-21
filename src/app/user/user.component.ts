import { AuthService } from './../core/services/auth.service';
import { Component, DestroyRef } from '@angular/core';
import { GuestHouse } from '../booking.models';
import { GuesthouseService } from '../core/services/guesthouse.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-user',
  imports: [FormsModule, CommonModule, RouterLink, NgxPaginationModule, NavbarComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  allhouses : GuestHouse[] =[];
  filteredGuesthouses: GuestHouse[] = [];
  search: string = '';
  userId: string | null = null;

  constructor(public guestService:GuesthouseService,private authService:AuthService,private destroyRef:DestroyRef,private router:Router,private route:ActivatedRoute){ }
  trackById(index: number, item: any): number {
    return item.id; // Assuming 'id' is unique
  }
  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    console.log('🆔 User ID in component:', this.userId);

    if (!this.userId) {
      console.error('❌ No userId found! Redirecting to login...');
      this.router.navigate(['/login']);  // Redirect if no userId
      return;
    }

    this.guestService.getAll().subscribe((data)=>{
      this.allhouses=data
      this.filteredGuesthouses = [...this.allhouses];
    })
  }

  page: number = 1;
  itemsPerPage: number = 10;
  perPageOptions = [5, 8, 10, 15];

  onItemsPerPageChange(targetValue: string) {
    this.itemsPerPage = Number(targetValue);
    this.page = 1;
  }
  randomImages: string[] = [
    '/Hrooms/Hotel1.jpg',
    '/Hrooms/Hotel2.jpg',
    '/Hrooms/Hotel3.jpg',
    '/Hrooms/Hotel4.jpg'
  ];

  getRandomImage(id: number): string {
    return this.randomImages[id % this.randomImages.length];
  }

}
