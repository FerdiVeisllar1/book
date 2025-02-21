
import { GuestHouseDto } from './../../booking.models';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import {  Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GuesthouseService } from '../../core/services/guesthouse.service';

@Component({
  selector: 'app-create',
  standalone:true,
  imports:[FormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  constructor(private guestService:GuesthouseService , private router:Router,private location:Location){}
  formdata : GuestHouseDto = {
    id:Math.floor((Math.random() + 1) * 15),
    name:'',
    description:'',
  }
  onSubmit(){
    this.guestService.create(this.formdata).subscribe({
      next:(data)=>{
        this.router.navigate(['/admin'])

      },
      error:(err)=>{
        console.log(err)
      }
    });
    this.goBack();
  }
goBack(){
  this.location.back();;
}
}
