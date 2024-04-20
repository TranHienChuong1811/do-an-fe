import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SharedModule} from "../shared-module";
import {ToastrService} from "ngx-toastr";
import {BsModalRef} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  providers: [ToastrService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  param: any = {
    username: '',
    password: ''
  };

  constructor(private http: HttpClient, private toast: ToastrService, private bsModalRef: BsModalRef) {
  }

  login() {
    this.http.post('/api/login', this.param)
      .subscribe((res: any) => {
        console.log(res);
        if (res?.status == 'OK') {
          localStorage.setItem('token', btoa(this.param));
          window.location.reload();
        } else {
          this.toast.error('Login failed');
        }
      });
  }
}
