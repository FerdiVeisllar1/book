import { GuesthouseService } from '../core/services/guesthouse.service';
import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, OnInit, DestroyRef, TemplateRef } from '@angular/core';
import { GuestHouse } from '../booking.models';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalService } from '../shared/modal.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet, NgxPaginationModule,NavbarComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit {
  allhouses: GuestHouse[] = [];
  filteredGuesthouses: GuestHouse[] = [];
  searchQuery: string = '';
  selectedGuesthouseId: number | null = null;
  selectedGuesthouse: GuestHouse | null = null;

  constructor(
    public guestService: GuesthouseService,
    private destroyRef: DestroyRef,
    public modalService: ModalService
  ) {}

  ngAfterViewInit() {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
      sidebar.style.display = "block";
    }
  }

  trackById(index: number, item: any): number {
    return item.id;
  }

  ngOnInit(): void {
    this.guestService.getAll().subscribe((data) => {
      this.allhouses = data;
      this.filteredGuesthouses = [...this.allhouses];
    });
  }

  onSearch(query: string) {
    this.searchQuery = query.trim().toLowerCase();
    this.filteredGuesthouses = this.allhouses.filter(g =>
      (g.name?.toLowerCase() ?? '').includes(this.searchQuery)
    );
  }


  onDelete(id: number) {
    const sub = this.guestService.delete(id).subscribe(() => {
      this.guestService.getAll().subscribe((data) => {
        this.allhouses = data;
        this.filteredGuesthouses = [...this.allhouses];
      });
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
  sortColumn: keyof GuestHouse | null = null;
sortDirection: 'asc' | 'desc' = 'asc';

get sortedGuesthouses() {
  if (!this.sortColumn) {
    return this.filteredGuesthouses; // Default order if no sorting applied
  }

  return [...this.filteredGuesthouses].sort((a, b) => {
    const valueA = a[this.sortColumn!];
    const valueB = b[this.sortColumn!];

    // Check if the values are numbers or strings
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    } else {
      return this.sortDirection === 'asc'
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    }
  });
}

  sortTable(column: keyof GuestHouse) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  getSortIcon(column: keyof GuestHouse) {
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? 'bi-sort-up' : 'bi-sort-down';
    }
    return 'bi-sort';
  }


}
