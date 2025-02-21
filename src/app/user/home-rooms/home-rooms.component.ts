import { CommonModule } from '@angular/common';
import { Component, DestroyRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { AmenitiesEnum, RoomDto } from '../../booking.models';
import { GuesthouseService } from '../../core/services/guesthouse.service';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-home-rooms',
  imports: [NgxPaginationModule,CommonModule,FormsModule,RouterLink,NavbarComponent],
  templateUrl: './home-rooms.component.html',
  styleUrl: './home-rooms.component.css'
})
export class HomeRoomsComponent {
 allRooms : RoomDto[] =[];
    filteredRooms: RoomDto[] = [];
  search: string = '';
  amenitiesList = Object.entries(AmenitiesEnum)
  .filter(([key, value]) => !isNaN(Number(value))) // filter out reverse-mapped keys
  .map(([key, value]) => ({ label: key, value: value as number }));

    constructor(public guestService:GuesthouseService,private destroyRef:DestroyRef,private router:Router,
        private route:ActivatedRoute){ }
    trackById(index: number, room: RoomDto): number {
      return room.id; // Assuming 'id' is unique
    }

    ngOnInit(): void {
      this.route.paramMap.subscribe((param)=>{
        let id = Number(param.get('id'))
        this.getById(id);
})};

    getById(id:number){
      this.guestService.getRooms(id).subscribe((data)=>{
        this.allRooms = data;
        this.filteredRooms = [...this.allRooms];
      })
    }
    onSearchRooms() {
      this.filteredRooms = this.allRooms.filter(g =>
        g.name!.toLowerCase().includes(this.search.trim().toLowerCase()) // Use 'title' instead of 'name'
      );
    }

    page: number = 1; //current page
    itemsPerPage: number = 10; // default
    perPageOptions = [5, 8, 10, 15]; //dropdown options for user to choose

    onItemsPerPageChange(targetValue: string) {
    this.itemsPerPage = Number(targetValue); // passing template var (#targetValue) as arg to this method in html -> easiest way in this case
    this.page = 1;}



    getAmenitiesLabels(amenities?: AmenitiesEnum[]): string {
      if (!amenities || amenities.length === 0) {
        return 'None';
      }

      return amenities.map(amenityValue => {
        const foundAmenity = this.amenitiesList.find(a => a.value === amenityValue);
        return foundAmenity ? foundAmenity.label : 'Unknown';
      }).join(', ');
    }
    onReject(){
      window.alert("You need to be logged in to continue")
    }

}

