import {  GuestHouse, GuestHouseDto, RoomDto, CreateBookingDto, GetUserDto, UpdateUserDto, UpsertRoomDto, UpsertGuestHouseDto, BookDto, } from './../../booking.models';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class GuesthouseService {
 // Store guesthouse ID
 private guesthouseId: number | null = null;

 getGuesthouseId(): number | null {
  return this.guesthouseId || Number(localStorage.getItem('guesthouseId')) || null;
}

 setGuesthouseId(id: number) {
   localStorage.setItem('guesthouseId', id.toString());
 }
  constructor(private httpClient: HttpClient, private router: Router) {}

  apiUrl = 'https://booking-api.asystems.al/';

  getAll() {
    return this.httpClient.get<GuestHouseDto[]>(this.apiUrl + 'api/GuestHouse');
  }
  getAvailableGuestHouses(checkIn?: string, checkOut?: string, numberOfBeds?: number) {
    let params = new HttpParams();

    if (checkIn) params = params.set('checkIn', checkIn);
    if (checkOut) params = params.set('checkOut', checkOut);

    if (numberOfBeds !== undefined && !isNaN(numberOfBeds) && numberOfBeds > 0) {
      params = params.set('numberOfBeds', numberOfBeds.toString());
    }

    console.log('Query Params:', params.toString()); // Debugging log

    return this.httpClient.get<GuestHouseDto[]>(`${this.apiUrl}api/GuestHouse/`, { params });
  }



  create(data: UpsertGuestHouseDto) {
    return this.httpClient.post(this.apiUrl + 'api/GuestHouse', data);
  }

  update(data: UpsertGuestHouseDto) {
    return this.httpClient.put<UpsertGuestHouseDto>(
      `${this.apiUrl}api/GuestHouse/${data.name}`,
      data
    );
  }

  edit(id: number) {
    return this.httpClient.get<GuestHouseDto>(this.apiUrl + `api/GuestHouse/${id}`);
  }

  delete(id: number) {
    return this.httpClient.delete<GuestHouseDto>(`${this.apiUrl}api/GuestHouse/${id}`);
  }

  getRooms(id: number) {
    return this.httpClient.get<RoomDto[]>(`${this.apiUrl}api/Room/GuestHouse/${id}`);
  }

  createRoom(data: UpsertRoomDto) {
    return this.httpClient.post(`${this.apiUrl}api/Room`, data);
  }

  updateRoom(data: RoomDto) {
    return this.httpClient.put<RoomDto>(`${this.apiUrl}api/Room/${data.id}`, data);
  }

  editRoom(id: number) {
    return this.httpClient.get<RoomDto>(`${this.apiUrl}api/Room/${id}`);
  }

  deleteRoom(id: number) {
    return this.httpClient.delete<RoomDto>(`${this.apiUrl}api/Room/${id}`);
  }
  getBookedDays(id: number){
    return this.httpClient.get<RoomDto[]>(`${this.apiUrl}api/Bookings/${id}`);
  }
  getUsers(){
    return this.httpClient.get<GetUserDto[]>(this.apiUrl + 'api/Users');
  }
  getUser(id: string) {
    return this.httpClient.get<GetUserDto>(this.apiUrl + `api/Users/${id}`);
  }
  editUser(id: string) {
    return this.httpClient.get<UpdateUserDto>(`${this.apiUrl}api/Users/${id}`);
  }
  updateUser(id: string, data: UpdateUserDto) {
    return this.httpClient.put<UpdateUserDto>(
      `${this.apiUrl}api/Users/${id}`,
      data
    );
  }

  bookRoom(data: CreateBookingDto) {
    return this.httpClient.post<CreateBookingDto>(
      `${this.apiUrl}api/Room/Book`,
      data);
  }

  getBookedUser(id:string) {
    return this.httpClient.get<BookDto[]>(
      `${this.apiUrl}api/Bookings/User/${id}`,
      );
  }
  getTop(){
    return this.httpClient.get<GuestHouseDto[]>(this.apiUrl + 'api/GuestHouse/top-five');
  }
}
