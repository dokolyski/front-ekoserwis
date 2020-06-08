import { Component, OnInit } from '@angular/core';
import {ToastService} from '../../shared/services/toast.service';
import {UserService} from '../../shared/services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  type = 'l';
  repeatPassword: string;
  password: string;
  email: string;

  constructor(private router: Router, private toastService: ToastService, private userService: UserService) { }

  ngOnInit() {
  }

  private validateEmail(text: string): boolean {
    const re = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    return re.test(String(text).toLowerCase());
  }

  private logIn() {
    this.userService.login(this.email, this.password).then( (response) => {
      this.userService.setJWT(response.headers.get('Authorization'));
      this.toastService.success('Zalogowano!');
      this.router.navigate(['profile/details']);
    }).catch(reason => {
      this.toastService.error('Nieprawidłowy email lub hasło');
    });
  }

  private logUp() {
    this.userService.register(this.email, this.password).then(() => {
      this.toastService.success(`Zarejestrowano!`);
      this.type = 'l';
    }).catch(reason => {
      this.toastService.error(reason.error.message);
    });
  }

  buttonClicked() {
    console.log('click');
    let valid = true;
    if (!this.validateEmail(this.email)) {
      valid = false;
      this.toastService.error('Niepoprawny format adresu email');
    }
    if (!this.password || this.password.length < 6) {
      valid = false;
      this.toastService.error('Hasło powinno mieć conajmniej 6 znaków');
    }
    if (valid) {
        if (this.type === 'l') {
        this.logIn();
      } else if (this.type === 'r') {
          if (this.password !== this.repeatPassword) {
            valid = false;
            this.toastService.error('Podane hasła nie są takie same');
          } else {
            this.logUp();
          }
      }
    }
  }
}
