import { CommonModule } from '@angular/common';
import { Component, OnInit, } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AmenitiesEnum, BookDto, RoomDto, UpsertRoomDto } from '../../booking.models';
import { GuesthouseService } from '../../core/services/guesthouse.service';
import { ActivatedRoute, Router, RouterLink,  } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from "../../navbar/navbar.component";
@Component({
  selector: 'app-book',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent implements OnInit{
  constructor(private guestService:GuesthouseService , private router:Router,private location:Location, private route:ActivatedRoute,private authService:AuthService){}
  formdata : RoomDto = {
    id:0,
    name:'',
    description:'',
    guestHouseId:0,
    price:0,
    numberOfBeds:0,
    image:'',
    amenities:[]
  }
  roomForm = new FormGroup({
    id: new FormControl(),
    name: new FormControl('',{validators: [Validators.required, Validators.maxLength(20)]}),
    description: new FormControl('',{validators: [Validators.required, Validators.maxLength(60)]}),
    image: new FormControl('',{validators: [Validators.required]}),
    price: new FormControl(0, {validators: [Validators.required]}),
    numberOfBeds: new FormControl(0, {validators: [Validators.required]}),
    amenities: new FormControl<number[]>([]),
    });
    roomId: number = 0;
    userId: string | null = null;

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


    ngOnInit(): void {
      this.route.paramMap.subscribe((param) => {
        let id = Number(param.get('id'));
        if (!isNaN(id) && id > 0) {
          this.roomId = id; // Assign roomId correctly
          this.getById(id);
        } else {
          console.error("Invalid roomId:", id);
        } this.userId = this.authService.getUserId();
        console.log('🆔 User ID in component:', this.userId);

        if (!this.userId) {
          console.error('❌ No userId found! Redirecting to login...');
          this.router.navigate(['/login']);  // Redirect if no userId
          return;
        }
      });
    }
    getById(id: number) {
      this.guestService.editRoom(id).subscribe((data) => {
        this.formdata = data;

        // Update form with fetched data
        this.roomForm.patchValue({
          id: data.id,
          name: data.name,
          description: data.description,
          image: data.image,
          price: data.price,
          numberOfBeds: data.numberOfBeds,
          amenities: data.amenities || [] // Ensure it doesn't break if amenities are missing
        });
      });
    }
    update() {
      if (this.roomForm.valid) {
        const updatedRoom: RoomDto = {
          id:this.roomForm.get('id')?.value || '',
          // Ensure ID is not lost
          name: this.roomForm.get('name')?.value || '',
          description: this.roomForm.get('description')?.value || '',
          guestHouseId: this.formdata.guestHouseId, // Keep the existing guestHouseId
          price: this.roomForm.get('price')?.value || 0,
          numberOfBeds: this.roomForm.get('numberOfBeds')?.value || 0,
          image: this.formdata.image, // Retain image since it's Base64
          amenities: this.roomForm.get('amenities')?.value || [] // Ensure amenities is an array
        };

        console.log("Submitting room update:", updatedRoom); // Debugging log

        this.guestService.updateRoom(updatedRoom).subscribe({
          next: () => {
            console.log("Update successful!");
            this.goBack();
          },
          error: (err) => {
            console.error("Update failed:", err);
          }
        });
      } else {
        console.warn("Form is invalid!", this.roomForm.errors);
      }
    }


goBack(){
  this.location.back();;

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
getAmenitiesLabels(amenities?: AmenitiesEnum[]): string {
  if (!amenities || amenities.length === 0) {
    return 'None';
  }

  return amenities.map(amenityValue => {
    const foundAmenity = this.amenitiesList.find(a => a.value === amenityValue);
    return foundAmenity ? foundAmenity.label : 'Unknown';
  }).join(', ');
}
pricePerNight = 179;
availability = [
  { date: '2025-03-01', price: 200 },
  { date: '2025-03-02', price: 200 },
  { date: '2025-03-03', price: 179 },
  { date: '2025-03-04', price: 179 },
  // Add more dates as needed
];

roomDetails = {
  adults: 3,
  children: 1,
  amenities: ['air-conditioning', 'free wi-fi', 'hairdryer', 'in-room safety', 'laundry', 'minibar', 'telephone'],
  view: 'ocean, beach',
  size: '40m²',
  bedType: 'queen bed, sofa bed',
  categories: 'triple'
};

checkInDate: string | null = null;
checkOutDate: string | null = null;

checkAvailability() {
  if (this.checkInDate && this.checkOutDate) {
    alert(`Checking availability from ${this.checkInDate} to ${this.checkOutDate}`);
  } else {
    alert('Please select check-in and check-out dates.');
  }
}
;
;  // Assuming the user's name is provided

bookRoom() {
  if (!this.checkInDate || !this.checkOutDate) {
    alert('Please complete all fields before booking.');
    return;
  }

  const bookingData: BookDto = {
    id: 0, // Assigned by backend
    roomId: this.roomId, // Ensure correct roomId
    bookFrom: this.checkInDate,
    bookTo: this.checkOutDate,
    room: {
      id: this.roomId, // Ensure the nested room object has the correct ID
      name: this.formdata.name,
      description: this.formdata.description,
      guestHouseId: this.formdata.guestHouseId,
      price: this.formdata.price,
      numberOfBeds: this.formdata.numberOfBeds,
      image: this.formdata.image,
      amenities: this.formdata.amenities || []
    }
  };

  console.log("Booking Data Sent:", bookingData);

  this.guestService.bookRoom(bookingData).subscribe({
    next: () => {
      alert('Booking successful!');
      this.router.navigate(['/confirmation']);
    },
    error: (err) => {
      console.error('Booking failed:', err);
      alert('Booking failed. Please try again.');
    }
  });
}


}





