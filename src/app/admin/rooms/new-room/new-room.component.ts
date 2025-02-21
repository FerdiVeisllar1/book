import { GuesthouseService } from '../../../core/services/guesthouse.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { AmenitiesEnum, RoomDto, UpsertRoomDto } from '../../../booking.models';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-room',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './new-room.component.html',
  styleUrl: './new-room.component.css'
})
export class NewRoomComponent implements OnInit {
  formdata: UpsertRoomDto = {
    name: '',
    description: '',
    guestHouseId: 0,
    price: 0,
    numberOfBeds: 0,
    image: '',
    amenities: [] as number[]
  };

  roomForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl(0, Validators.required),
    numberOfBeds: new FormControl(0, Validators.required),
    image: new FormControl('', Validators.required),
    amenities: new FormControl<number[]>([]) // Keep amenities here
  });

  amenitiesList = Object.values(AmenitiesEnum)
    .filter(value => typeof value === 'number')
    .map(value => ({
      value: value as number,
      label: AmenitiesEnum[value]
    }));

  constructor(
    private guestService: GuesthouseService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

    guesthouseId: number | null = null;


    ngOnInit(): void {
      this.route.parent?.paramMap.subscribe((param) => {
        this.guesthouseId = Number(param.get('guesthouseId'));

        console.log('Guesthouse ID from Route:', this.guesthouseId);

        if (!this.guesthouseId) {
          console.error("⚠️ Guesthouse ID is missing!");
        } else {
          this.formdata.guestHouseId = this.guesthouseId;
        }
      });
    }


  loadRoomData(room: RoomDto) {
    if (!room) return;

    this.formdata = {
      ...room,
      amenities: room.amenities ?? [] // ✅ Ensure amenities is always an array
    };

    this.roomForm.patchValue({
      name: room.name,
      description: room.description,
      price: room.price,
      numberOfBeds: room.numberOfBeds,
      image: '',
      amenities: [...(room.amenities ?? [])] // ✅ Ensures a valid iterable
    });
  }

  // Handle checkbox changes
  onAmenityChange(event: any, amenityId: number) {
    let selectedAmenities = this.roomForm.get('amenities')?.value || [];

    if (event.target.checked) {
      if (!selectedAmenities.includes(amenityId)) {
        selectedAmenities.push(amenityId);
      }
    } else {
      selectedAmenities = selectedAmenities.filter(id => id !== amenityId);
    }

    this.roomForm.get('amenities')?.setValue(selectedAmenities);
    this.formdata.amenities = selectedAmenities;
  }

  onSubmit() {
    if (!this.guesthouseId || this.guesthouseId === 0) {
      alert("Error: Guesthouse ID is missing.");
      return;
    }

    this.formdata.guestHouseId = this.guesthouseId; // ✅ Assign it before submitting

    console.log("🚀 Submitting Room:", this.formdata);

    this.guestService.createRoom(this.formdata).subscribe({
      next: (data) => {
        console.log("✅ Room Created:", data);
        this.goBack();
      },
      error: (err) => {
        console.error("❌ Error Creating Room:", err);
        alert("Failed to create room.");
      }
    });
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

          const desiredWidth = 150;  // Set desired width
          const desiredHeight = 100; // Set desired height

          canvas.width = desiredWidth;
          canvas.height = desiredHeight;

          if (ctx) {
            // Resize and draw the image on canvas
            ctx.drawImage(img, 0, 0, desiredWidth, desiredHeight);

            // Convert canvas content to Base64 format
            let base64String = canvas.toDataURL('image/jpeg'); // Full Base64 string

            // Remove the prefix (e.g., "data:image/jpeg;base64,")
            this.formdata.image = base64String.split(',')[1];

            console.log(this.formdata.image); // Logs the cleaned Base64 string
          }
        };
      };

      reader.readAsDataURL(file);
    } else {
      console.error('Invalid file type. Please upload an image.');
    }
  }

  goBack() {
    this.location.back();
  }
}

