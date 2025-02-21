import { Component, DestroyRef, OnInit } from '@angular/core';
import { GuestHouse, RoomDto } from '../../booking.models';
import { GuesthouseService } from '../../core/services/guesthouse.service';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../shared/modal.service';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [RouterLink, CommonModule, NgxPaginationModule, FormsModule, RouterOutlet,NavbarComponent],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent implements OnInit {
  allRooms: RoomDto[] = [];
  filteredRooms: RoomDto[] = [];
  searchQuery: string = '';
  selectedGuesthouseId: number | null = null;
  selectedGuesthouse: GuestHouse | null = null;

  constructor(
    public guestService: GuesthouseService,
    private destroyRef: DestroyRef,
    private router: Router,
    private route: ActivatedRoute,
    public modalService:ModalService
  ) {}

  guestHouseId: number = 0;
  trackById(index: number, room: RoomDto): number {
    return room.id; // Ensures optimal rendering
  }
  ngOnInit(): void {

    this.route.paramMap.subscribe((param) => {
      let id = Number(param.get('guesthouseId')); // Ensure correct parameter name
      if (id) {
        this.guestHouseId = id;
        this.getById(id);
      } else {
        console.error("❌ Guesthouse ID not found in the route!");
      }
    });
  }
  getById(id: number) {
    this.guestService.getRooms(id).subscribe((data) => {
      this.allRooms = data;
      this.filteredRooms = [...this.allRooms];
      this.sortedRooms = [...this.filteredRooms];
    });
  }
  sortColumn: keyof RoomDto | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  sortedRooms: RoomDto[] = [];




  sortTable(column: keyof RoomDto) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.sortedRooms = [...this.filteredRooms].sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (valueA == null) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueB == null) return this.sortDirection === 'asc' ? 1 : -1;

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }

      return this.sortDirection === 'asc'
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });
  }

  onSearch(query: string) {
    this.sortedRooms = this.filteredRooms.filter(room =>
      room.name.toLowerCase().includes(query.toLowerCase()) ||
      room.description.toLowerCase().includes(query.toLowerCase())
    );
  }




  navigateToNewRoom(guesthouseId: number) {
    console.log("Navigating to new room with Guesthouse ID:", guesthouseId);
    this.guestService.setGuesthouseId(guesthouseId);
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onDelete(id: number) {
    const sub = this.guestService.deleteRoom(id).subscribe(() => {
      this.getById(this.guestHouseId!);
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  page: number = 1;
  itemsPerPage: number = 10;
  perPageOptions = [5, 8, 10, 15];

  onItemsPerPageChange(targetValue: string) {
    this.itemsPerPage = Number(targetValue);
    this.page = 1;
  }


  openDeleteModal(guesthouse: GuestHouse) {
    this.selectedGuesthouse = guesthouse;
    this.modalService.open(); // ✅ Open modal
  }

  confirmDelete() {
    if (this.selectedGuesthouse) {
      this.onDelete(this.selectedGuesthouse.id);
      this.modalService.close(); // ✅ Close modal after delete
    }
  }

}
