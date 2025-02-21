import { GuesthouseService } from '../../core/services/guesthouse.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GuestHouseDto } from '../../booking.models';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit',
  standalone:true,
  imports:[FormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit{

  constructor(
    private guestHouseService:GuesthouseService,
    private router:Router,
    private route:ActivatedRoute,
  private location:Location){}

    formdata: GuestHouseDto = {
      id:0,
      name:'',
      description:'',
    }


ngOnInit():void{
  this.route.paramMap.subscribe((param)=>{
    let id = Number(param.get('id'))
    this.getById(id)
  })
}
getById(id:number){
  this.guestHouseService.edit(id).subscribe((data)=>{
    this.formdata = data;
  })
}

update(){
  this.guestHouseService.update(this.formdata).subscribe({
    next:(data)=>{
      this.router.navigate(['/admin'])
    },
    error:(err)=>{
      console.log(err)
    }
  })
  this.goBack();
}
goBack(){
  this.location.back();;
}
}
