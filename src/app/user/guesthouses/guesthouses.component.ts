import { Component } from '@angular/core';
import { GuestHouseDto } from '../../booking.models';
import { GuesthouseService } from '../../core/services/guesthouse.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NavbarComponent } from "../../navbar/navbar.component";

@Component({
  selector: 'app-guesthouses',
  imports: [CommonModule, FormsModule, NgxPaginationModule, NavbarComponent,RouterLink],
  templateUrl: './guesthouses.component.html',
  styleUrl: './guesthouses.component.css',
})
export class GuesthousesComponent {
  allhouses: GuestHouseDto[] = [];
  filteredGuesthouses: GuestHouseDto[] = [];
  search: string = '';

  page: number = 1;
  itemsPerPage: number = 10;
  perPageOptions = [5, 8, 10, 15];

  constructor(
    public guestService: GuesthouseService,
    public route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const checkIn = params['checkIn'];
      const checkOut = params['checkOut'];
      const numberOfBeds = params['numberOfBeds'] ? Number(params['numberOfBeds']) : undefined;

      console.log('Received Query Params:', { checkIn, checkOut, numberOfBeds }); // Debugging log

      if (checkIn || checkOut || numberOfBeds) {
        this.guestService.getAvailableGuestHouses(checkIn, checkOut, numberOfBeds).subscribe({
          next: (data) => {
            console.log('Filtered Guesthouses:', data); // Debugging log
            this.filteredGuesthouses = data;
          },
          error: (err) => console.error('Error fetching guest houses:', err),
        });
      } else {
        this.guestService.getAll().subscribe((data) => {
          this.allhouses = data;
          this.filteredGuesthouses = [...this.allhouses];
        });
      }
    });
  }

  trackById(index: number, item: any): number {
    return item.id;
  }

  getRandomImage(id: number): string {
    const randomImages = [
      '/Hrooms/Hotel1.jpg',
      '/Hrooms/Hotel2.jpg',
      '/Hrooms/Hotel3.jpg',
      '/Hrooms/Hotel4.jpg',
    ];
    return randomImages[id % randomImages.length];
  }
  onItemsPerPageChange(targetValue: string) {
    this.itemsPerPage = Number(targetValue);
    this.page = 1;
  }
}
