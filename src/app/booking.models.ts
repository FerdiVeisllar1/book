
  export enum AmenitiesEnum {
    WiFi = 1,
    Pool,
    Gym,
    Parking,
    AirConditioning,
    Breakfast,
    PetFriendly,
    Elevator
  }

  export interface ApiErrorResponse {
    type?: string;
    title?: string;
    status: number;
    detail?: string;
    instance?: string;
    errors?: Record<string, string[]>;
  }

export interface RoomAmenity {
  id: number;
  roomId: number;
  room?: Room;
  amenities: AmenitiesEnum;
}
export interface AuthResponseDto {
  id?: string;
  username?: string;
  token?: string;
  role?: string;
}

export interface Room {
  id: number;
  name?: string;
  description?: string;
  image?: string;
  price: number;
  numberOfBeds: number;
  createdBy?: string;
  createdDate: string;
  guestHouse?: GuestHouse;
  guestHouseId: number;
  amenities?: RoomAmenity[];
  books?: Book[];
}

export interface RoomDto {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  numberOfBeds: number;
  guestHouseId: number;
  amenities?: AmenitiesEnum[];
}


export interface Book {
  id: number;
  roomId: number;
  room: Room;
  bookFrom: string;
  bookTo: string;
  createdBy?: string;
  createdDate: string;
}


export interface BookDto {
  id: number;
  roomId: number;
  bookFrom: string;
  bookTo: string;
  room?: RoomDto;
}
export interface CreateBookingDto {
  roomId: number;
  bookFrom: string;
  bookTo: string;
}

export interface GuestHouse {
  id: number;
  name?: string;
  description?: string;

}

export interface GuestHouseDto {
  id: number;
  name: string;
  description: string;
}

export interface LoginDto {
  email?: string;
  password?: string;
}

export interface RegisterDto {
  username: string; // Min: 3, Max: 20
  firstName: string; // Min: 2, Max: 50
  lastName: string; // Min: 2, Max: 50
  email: string; // Must be a valid email
  password: string; // Must match regex pattern
  phoneNumber: string;
}

export interface GetUserDto {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
}

export interface UpdateUserDto {
  firstName: string; // Min: 2, Max: 50
  lastName: string;  // Min: 2, Max: 50
  phoneNumber: string; // Must be a valid phone number
  email: string; // Must be a valid email
}
export interface UpsertGuestHouseDto {
  name: string; // Min: 3, Max: 20
  description: string; // Min: 10, Max: 60
}
export interface UpsertRoomDto {
  name: string; // Min: 3, Max: 50
  description: string; // Min: 10, Max: 500
  image: string; // Base64-encoded image
  price: number; // Min: 0.01
  numberOfBeds: number; // Min: 1, Max: 10
  guestHouseId: number; // Min: 1, Max: 2147483647
  amenities?: AmenitiesEnum[]; // Optional amenities list
}
