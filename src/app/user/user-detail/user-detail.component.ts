import { Component, OnInit } from '@angular/core';
import { GuesthouseService } from '../../core/services/guesthouse.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from "../../navbar/navbar.component";

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent implements OnInit {
  constructor(
    private guestService: GuesthouseService,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}


  userId: string | null = null;
  isEditing: boolean = false; // Controls edit mode

  userForm = new FormGroup({
    id: new FormControl<string | null>(null),
    firstName: new FormControl<string>('', {
      validators: [Validators.required, Validators.maxLength(20)],
      nonNullable: true
    }),
    lastName: new FormControl<string>('', {
      validators: [Validators.required, Validators.maxLength(60)],
      nonNullable: true
    }),
    email: new FormControl<string>('', {
      validators: [Validators.required, Validators.maxLength(60)],
      nonNullable: true
    }),
    phoneNumber: new FormControl<string>('', {
      validators: [Validators.required, Validators.maxLength(60)],
      nonNullable: true
    })
  });

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    console.log('🆔 User ID in component:', this.userId);

    if (!this.userId) {
      console.error('❌ No userId found! Redirecting to login...');
      this.router.navigate(['/login']);
      return;
    }

    this.route.paramMap.subscribe((param) => {
      const id = param.get('id');
      if (id) {
        this.getById(id);
      }
    });
  }

  getById(id: string) {
    this.guestService.getUser(id).subscribe((data) => {
      if (data) {
        this.userForm.patchValue({
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          email: data.email
        });
      }
    });
  }

  enableEdit() {
    this.isEditing = true;
  }

  saveChanges() {
    if (!this.userId) {
      console.error("❌ Cannot update: User ID is missing!");
      return;
    }

    if (this.userForm.valid) {
      const updatedUser = {
        firstName: this.userForm.value.firstName || '',
        lastName: this.userForm.value.lastName || '',
        email: this.userForm.value.email || '',
        phoneNumber: this.userForm.value.phoneNumber || ''
      };

      console.log("Submitting user update:", updatedUser);

      this.guestService.updateUser(this.userId, updatedUser).subscribe({
        next: () => {
          console.log("✅ Update successful!");
          this.isEditing = false; // Exit edit mode after saving
        },
        error: (err) => {
          console.error("❌ Update failed:", err);
        }
      });
    } else {
      console.warn("⚠️ Form is invalid!", this.userForm.errors);
    }
  }

  goBack() {
    this.location.back();
  }

}
