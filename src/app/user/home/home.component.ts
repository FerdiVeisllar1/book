import { GuestHouseDto } from './../../booking.models';
import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GuesthouseService } from '../../core/services/guesthouse.service';


@Component({
  selector: 'app-home',
  imports: [RouterLink,CommonModule,ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
 top5: GuestHouseDto[] = [];
 chunkedGuesthouses: GuestHouseDto[][] = [];
  selectedBackground: string = 'Bcity.jpg'; // Default background
  constructor(private guestService:GuesthouseService,private fb: FormBuilder,private router:Router){
    this.searchForm = this.fb.group({
      checkIn: [''],
      checkOut: [''],
      numberOfBeds: [''],
    });
  }
  chunkArray(arr: GuestHouseDto[], size: number): GuestHouseDto[][] {
    let chunkedArr = [];
    for (let i = 0; i < arr.length; i += 1) {
      chunkedArr.push(arr.slice(i, i + size));
    }
    return chunkedArr;
  }
  setBackground(image: string) {
    this.selectedBackground = image;
  }
  ngOnInit(): void {
    this.guestService.getAvailableGuestHouses();
    this.guestService.getTop().subscribe((data) => {
      this.top5 = data;
      this.chunkedGuesthouses = this.chunkArray(this.top5, 3);

    });
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
  lastScrollTop = 0;
  isHidden = false;

  @HostListener('window:scroll', [])
  onScroll(): void {
    const currentScroll = window.scrollY;
    this.isHidden = currentScroll > this.lastScrollTop;
    this.lastScrollTop = currentScroll;
  }
  searchForm: FormGroup;

  onSearch() {
    const { checkIn, checkOut, numberOfBeds } = this.searchForm.value;
    this.router.navigate(['/guesthouses'], {
      queryParams: {
        checkIn,
        checkOut,
        numberOfBeds,
      },
    });
  }


}

