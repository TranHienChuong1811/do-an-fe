import {NgModule} from "@angular/core";
import {HttpClientModule} from "@angular/common/http";
import {ToastrModule} from "ngx-toastr";
import {CommonModule} from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule
} from "@angular/forms";
import {ModalModule} from "ngx-bootstrap/modal";
import {NgxSpinnerModule} from "ngx-spinner";

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-right',
      closeButton: true,
    }),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    NgxSpinnerModule.forRoot({
      type: 'ball-clip-rotate-multiple'
    })
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule
  ]
})
export class SharedModule {
}
