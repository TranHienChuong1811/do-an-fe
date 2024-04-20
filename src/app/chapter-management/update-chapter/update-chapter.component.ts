import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {BsModalRef} from "ngx-bootstrap/modal";
import {SharedModule} from "../../shared-module";

@Component({
  selector: 'app-update-chapter',
  standalone: true,
  imports: [SharedModule],
  providers: [ToastrService],
  templateUrl: './update-chapter.component.html',
  styleUrl: './update-chapter.component.scss'
})
export class UpdateChapterComponent implements OnInit {
  @Input() title: string = "";
  @Input() isAdd: boolean = true;
  @Output() action = new EventEmitter();
  param: any = {
    chapterId: '',
    title: '',
    content: '',
    storyId: '',
  };
  listStory: any = [];

  constructor(private http: HttpClient,
              private toast: ToastrService,
              private spinner: NgxSpinnerService,
              private bsModalRef: BsModalRef) {
  }

  ngOnInit(): void {
    this.getListOfStory();
  }

  close() {
    this.bsModalRef.hide();
  }

  getListOfStory() {
    this.http.get('/api/stories/all')
      .subscribe((res: any) => {
        this.listStory = res;
      });
  }

  update() {
    if (!this.isAdd && !this.param.chapterId) {
      this.toast.error('Vui lòng chọn chương cần cập nhật');
      this.bsModalRef.hide();
      return;
    }
    if (!this.param.title || !this.param.content) {
      this.toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    this.spinner.show();
    if (this.isAdd) {
      this.http.post('/api/chapter/add', this.param)
        .subscribe((res: any) => {
          this.spinner.hide();
          if (res?.status === 'OK') {
            this.toast.success('Thêm chương thành công');
            this.action.emit('add');
            this.bsModalRef.hide();
          } else {
            this.toast.error('Thêm chương thất bại');
          }
        });
    } else {
      this.http.patch(`/api/chapter/update`, this.param)
        .subscribe((res: any) => {
          this.spinner.hide();
          if (res?.status === 'OK') {
            this.toast.success('Cập nhật chương thành công');
            this.action.emit('update');
            this.bsModalRef.hide();
          } else {
            this.toast.error('Cập nhật chương thất bại');
          }
        });
    }
  }
}
