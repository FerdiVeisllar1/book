import { Component } from '@angular/core';
import { GuesthouseService } from '../../core/services/guesthouse.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GetUserDto } from '../../booking.models';
import { NavbarComponent } from '../../navbar/navbar.component';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule,NavbarComponent,NgxPaginationModule,RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  allusers: GetUserDto[] = [];
  filteredUsers: GetUserDto[] = [];
  searchQuery: string = '';
  page: number = 1;
  itemsPerPage: number = 10;
  perPageOptions = [5, 8, 10, 15];

  constructor(public guestService: GuesthouseService) { }

  ngOnInit(): void {
    this.guestService.getUsers().subscribe((data) => {
      this.allusers = data;
      this.filteredUsers = [...this.allusers];
    });
  }

  trackById(index: number, item: GetUserDto): any {
    return item.id; // Assuming 'id' is unique
  }

  onSearch(query: string) {
    this.searchQuery = query.trim().toLowerCase();
    this.filteredUsers = this.allusers.filter(g =>
      (g.firstName?.toLowerCase() ?? '').includes(this.searchQuery)
    );
  }

  onItemsPerPageChange(targetValue: string) {
    this.itemsPerPage = Number(targetValue);
    this.page = 1;
  }

  // Modified sortTable function to accept the property name as a string
  sortColumn: string = '';  // Track the current column being sorted
  sortDirection: 'asc' | 'desc' = 'asc';  // Track the sorting direction

  sortTable(property: keyof GetUserDto) {
    // Check if the same column is being clicked again, to toggle the direction
    if (this.sortColumn === property) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = property;
      this.sortDirection = 'asc';  // Default to ascending for new column
    }

    // Sort based on the selected column and direction
    this.filteredUsers = this.filteredUsers.sort((a, b) => {
      const valueA = a[property];
      const valueB = b[property];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc'
          ? valueA.localeCompare(valueB)  // Ascending order
          : valueB.localeCompare(valueA); // Descending order
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.sortDirection === 'asc'
          ? valueA - valueB  // Ascending order
          : valueB - valueA; // Descending order
      }

      return 0;  // Fallback case for undefined or unsupported types
    });
}

}
