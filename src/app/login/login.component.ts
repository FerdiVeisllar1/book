import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginDto, RegisterDto } from '../booking.models';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoginView: boolean = true;
  constructor(private authService: AuthService, private router: Router) {}

  register:RegisterDto ={
    email:'',
    password:'',
    phoneNumber:'',
    firstName:'',
    lastName:'',
    username:''
  }


    email:string ="";
    password:string= "";


  http = inject(HttpClient);

  onRegister() {
    console.log("Login Object:", this.register); // Debugging step

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    this.http.post("https://booking-api.asystems.al/api/Authentication/Register", this.register, { headers })
      .subscribe({
        next: (res: any) => {
         window.alert("Registration Success");
        },
        error: (error) => {
          console.error("Registration failed:", error);
          window.alert(error.error?.message || "Invalid credentials. Please try again.");
        }
      });
  }


  onLogin() {
    this.authService.login(this.email, this.password)
      .subscribe({
        next: (response) => {
          console.log("Login Success:", response);

          if (!response || !response.token || !response.role) {
            console.error("Invalid response format. Missing token or role.");
            window.alert("Login failed. Invalid response from server.");
            return;
          }

          this.authService.setToken(response.token, response.role,response.id);  // Pass role here
          this.authService.setUserId(response.userId); // Store user ID


          if (response.role === 'Admin') {

            this.router.navigate(['/admin']);
          } else if (response.role === 'User') {

            this.router.navigate(['/user']);
          } else {
            window.alert("Access Denied");
          }
        },
        error: (error) => {
          console.error("Login Failed:", error);
          window.alert(error.error?.message || "Invalid credentials. Please try again.");
        }
      });
  }


}


