import { Component, OnInit } from '@angular/core';
import {UserService} from '../shared/services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.userService.getProfile().then(value => {
      this.router.navigate(['profile/details']);
    }).catch(reason => {
      this.router.navigate(['profile/login']);
    });
  }

}
