import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { GuesthouseService } from '../../../core/services/guesthouse.service';
import { AmenitiesEnum, RoomDto } from '../../../booking.models';

@Component({
  selector: 'app-edit-room',
  standalone: true,
  imports:[FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './edit-room.component.html',
  styleUrl: './edit-room.component.css',
})
export class EditRoomComponent implements OnInit {
  roomId: number = 0;
  guestHouseId: number = 0; // Store guestHouseId for updates

  roomForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(60)]),
    price: new FormControl(0, [Validators.required]),
    numberOfBeds: new FormControl(0, [Validators.required]),
    image: new FormControl('', [Validators.required]),
    amenities: new FormControl<number[]>([]),
  });

  amenitiesList = Object.entries(AmenitiesEnum)
  .filter(([key, value]) => !isNaN(Number(value))) // filters out reverse-mapped enum keys
  .map(([key, value]) => ({ label: key, value: value as number }));

  onAmenityChange(event: Event, amenityValue: number) {
    const checked = (event.target as HTMLInputElement).checked;
    const currentAmenities = [...(this.roomForm.get('amenities')?.value || [])];

    if (checked) {
      if (!currentAmenities.includes(amenityValue)) {
        currentAmenities.push(amenityValue);
      }
    } else {
      const index = currentAmenities.indexOf(amenityValue);
      if (index !== -1) {
        currentAmenities.splice(index, 1);
      }
    }

    this.roomForm.get('amenities')?.setValue(currentAmenities);
    this.roomForm.get('amenities')?.updateValueAndValidity();

    console.log("Updated amenities:", this.roomForm.get('amenities')?.value);
  }
  constructor(
    private guestService: GuesthouseService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (!isNaN(id) && id > 0) {
        this.roomId = id;
        this.getById(id);
      }
    });
  }

  getById(id: number) {
    this.guestService.editRoom(id).subscribe({
      next: (data: RoomDto) => {
        console.log("✅ Room Data Fetched:", data);
        this.roomId = data.id; // Store ID
        this.guestHouseId = data.guestHouseId; // Store guestHouseId

        this.roomForm.patchValue({
          id: data.id,
          name: data.name,
          description: data.description,
          price: data.price,
          numberOfBeds: data.numberOfBeds,
          image: data.image || '',
          amenities: data.amenities || []
        });
      },
      error: (err) => console.error("❌ Error fetching room:", err),
    });
  }

  update() {
    if (this.roomForm.valid) {
      const updatedRoom: RoomDto = {
        id: this.roomId,
        guestHouseId: this.guestHouseId, // Ensure guestHouseId is included
        name: this.roomForm.get('name')?.value || '',
        description: this.roomForm.get('description')?.value || '',
        price: this.roomForm.get('price')?.value || 0,
        numberOfBeds: this.roomForm.get('numberOfBeds')?.value || 0,
        image: this.roomForm.get('image')?.value || '',
        amenities: this.roomForm.get('amenities')?.value || []
      };

      console.log("🚀 Updating Room:", updatedRoom);

      this.guestService.updateRoom(updatedRoom).subscribe({
        next: () => {
          console.log("✅ Update successful!");
          this.goBack();
        },
        error: (err) => console.error("❌ Update failed:", err),
      });
    } else {
      console.warn("⚠️ Form is invalid!", this.roomForm.errors);
    }
  }

  goBack() {
    this.location.back();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file && file.type.startsWith('image/')) { // Validate image type
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          const desiredWidth = 150;
          const desiredHeight = 100;

          canvas.width = desiredWidth;
          canvas.height = desiredHeight;

          if (ctx) {
            ctx.drawImage(img, 0, 0, desiredWidth, desiredHeight);
            let base64String = canvas.toDataURL('image/jpeg');
            this.roomForm.get('image')?.setValue(base64String.split(',')[1]);
            console.log(this.roomForm.get('image')?.value);
          }
        };
      };

      reader.readAsDataURL(file);
    } else {
      console.error('Invalid file type. Please upload an image.');
    }
  }
}
