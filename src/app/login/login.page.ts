import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { 
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonItem, IonInput, IonButton 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonItem, IonInput, IonButton,
    CommonModule, ReactiveFormsModule
  ]
})
export class LoginPage implements OnInit {

  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

 login() {
  if (this.loginForm.valid) {
    localStorage.setItem('isLoggedIn', 'true');

    this.router.navigateByUrl('/tabs/profile', { replaceUrl: true });
  }
}

   navigateToDashboard() {
    this.router.navigate(['/tabs'], { replaceUrl: true });
  }


}