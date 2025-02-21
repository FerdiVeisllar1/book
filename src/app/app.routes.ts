import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { GuesthousesComponent } from './user/guesthouses/guesthouses.component';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import { CreateComponent } from './admin/create/create.component';
import { authGuard } from './core/guards/auth.guard';
import { EditComponent } from './admin/edit/edit.component';
import { RoomsComponent } from './admin/rooms/rooms.component';
import { NewRoomComponent } from './admin/rooms/new-room/new-room.component';
import { EditRoomComponent } from './admin/rooms/edit-room/edit-room.component';
import { UserRoomsComponent } from './user/user-rooms/user-rooms.component';
import { roleGuard } from './core/guards/role.guard';
import { HomeComponent } from './user/home/home.component';
import { HomeRoomsComponent } from './user/home-rooms/home-rooms.component';
import { BookComponent } from './user/book/book.component';
import { UserProfileComponent } from './admin/user-profile/user-profile.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { UserBookingComponent } from './user/user-booking/user-booking.component';


export const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'guesthouses/rooms/:id',component:HomeRoomsComponent},
  {path:'guesthouses',component:GuesthousesComponent},
  {path:'admin',component:AdminComponent,canActivate: [authGuard, roleGuard],
    data: { role: 'Admin' },
    children:[
      {
        path:'create',
        component:CreateComponent
      },
      {
        path:'edit/:id',
        component:EditComponent
      },

    ]
   },
  {path:'user',component:UserComponent,canActivate: [authGuard, roleGuard],
    data: { role: 'User' }},
  {path:'login',component:LoginComponent},
  {
    path: 'admin/rooms/:guesthouseId',
    component: RoomsComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Admin' },
    children: [
      {
        path: 'new',
        component: NewRoomComponent
      },
      {
        path: 'edit/:id',
        component: EditRoomComponent
      }
    ]
  }
,
    { path: 'admin/rooms/:guesthouseId/new', component: NewRoomComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Admin' }
  },
  {path:'user/rooms/:id',component:UserRoomsComponent},
  {path:'user/rooms/:id/book/:id',component:BookComponent},
  {path:'profile',component:UserProfileComponent},
  {path:'profile/:id',component:UserDetailComponent},
  {path:'bookings/:id',component:UserBookingComponent}
];

@NgModule({
imports:[RouterModule.forRoot(routes)],
exports:[RouterModule]
})
export class AppRoutingModule{

}
