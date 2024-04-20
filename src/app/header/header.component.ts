import {
  Component,
  OnInit
} from '@angular/core';
import {NgClass} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {BsModalService} from "ngx-bootstrap/modal";
import {SharedModule} from "../shared-module";
import {LoginComponent} from "../login/login.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgClass,
    SharedModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  url = '';
  isLogin = false;

  constructor(private http: HttpClient,
              private bsModalService: BsModalService) {
  }

  ngOnInit(): void {
    this.url = window.location.href.split('/').pop() ?? '';
    const token = localStorage.getItem('token');
    if (token) {
      this.isLogin = true;
    }
  }

  openLogin() {
    this.bsModalService.show(LoginComponent, {
      class: ' modal-dialog-centered'
    });
  }

  protected readonly open = open;
}
