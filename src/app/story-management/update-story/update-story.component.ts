import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {
  HttpClient,
} from "@angular/common/http";
import {BsModalRef} from "ngx-bootstrap/modal";
import {
  ToastrService
} from "ngx-toastr";
import {SharedModule} from "../../shared-module";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-update-story',
  standalone: true,
  imports: [
    SharedModule
  ],
  providers: [ToastrService],
  templateUrl: './update-story.component.html',
  styleUrl: './update-story.component.scss'
})
export class UpdateStoryComponent {
  @Input() title: string = "";
  @Input() isAdd: boolean = true;
  @Output() action = new EventEmitter();
  formData = new FormData();
  param: any = {
    storyId: '',
    title: '',
    author: '',
    description: '',
  };
  @Input() isShowImage: boolean = false;
  imageSrc: string | undefined = "";

  constructor(private http: HttpClient,
              private toast: ToastrService,
              private spinner: NgxSpinnerService,
              private bsModalRef: BsModalRef) {
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    this.handleFiles(file);
  }

  close() {
    this.bsModalRef.hide();
  }

  handleFiles(file: any) {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.isShowImage = true;
        this.imageSrc = `${e.target?.result}`;
        this.formData.append('file', file);
      };
      reader.readAsDataURL(file);
    }
  }

  allowDrop(event: any) {
    event.preventDefault();
  }

  handleDrop(event: any) {
    event.preventDefault();
    const files = event.dataTransfer.files[0];
    this.handleFiles(files);
  }

  update() {
    if (!this.isAdd && !this.param.storyId) {
      this.toast.error('Vui lòng chọn truyện cần cập nhật');
      this.bsModalRef.hide();
      return;
    }
    if (!this.param.title || !this.param.author || !this.param.description) {
      this.toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    this.formData.append('title', this.param.title);
    this.formData.append('author', this.param.author);
    this.formData.append('description', this.param.description);
    if (!this.isAdd) {
      this.formData.append('storyId', this.param.storyId);
    }
    this.spinner.show();
    if (this.isAdd) {
      this.http.post('/api/stories/add', this.formData)
        .subscribe((res: any) => {
          this.resetForm();
          this.spinner.hide();
          if (res?.status === 'OK') {
            this.toast.success('Thêm truyện thành công');
            this.action.emit('add');
            this.bsModalRef.hide();
          } else {
            this.toast.error('Thêm truyện thất bại');
          }
        });
    } else {
      this.http.patch(`/api/stories/update`, this.formData)
        .subscribe((res: any) => {
          this.resetForm();
          this.spinner.hide();
          if (res?.status === 'OK') {
            this.toast.success('Cập nhật truyện thành công');
            this.action.emit('update');
            this.bsModalRef.hide();
          } else {
            this.toast.error('Cập nhật truyện thất bại');
          }
        });
    }
  }

  resetForm() {
    this.formData.delete('title');
    this.formData.delete('author');
    this.formData.delete('description');
  }
}
