import {
  Component,
  OnInit
} from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from "@angular/common/http";
import {BsModalService} from "ngx-bootstrap/modal";
import {SharedModule} from "../shared-module";
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {UpdateChapterComponent} from "./update-chapter/update-chapter.component";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-chapter-management',
  standalone: true,
  imports: [SharedModule, NgOptimizedImage, RouterLink],
  providers: [BsModalService, ToastrService],
  templateUrl: './chapter-management.component.html',
  styleUrl: './chapter-management.component.scss'
})
export class ChapterManagementComponent implements OnInit {
  list: any = [];

  constructor(private http: HttpClient,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private bsService: BsModalService) {
  }

  ngOnInit(): void {
    this.getChapterStory();
  }

  getChapterStory() {
    this.http.get('/api/chapter/all')
      .subscribe((res: any) => {
        this.list = res;
      });
  }

  deleteStory(chapterId: any) {
    const confirm = window.confirm('Bạn có chắc chắn muốn xóa chương này không?');
    if (confirm) {
      this.http.delete(`/api/chapter/delete/${chapterId}`)
        .subscribe(() => {
          this.getChapterStory();
        });
    }
  }

  openForm() {
    const bsRef = this.bsService.show(UpdateChapterComponent, {
      class: 'modal-lg modal-dialog-centered',
      initialState: {
        title: 'Thêm chương mới',
        isAdd: true
      }
    });
    if (bsRef?.content?.action) {
      bsRef.content.action.subscribe(() => {
        this.getChapterStory();
      });
    }
  }

  updateForm(item: any) {
    const bsRef = this.bsService.show(UpdateChapterComponent, {
      class: 'modal-lg modal-dialog-centered',
      initialState: {
        title: 'Cập nhật truyện',
        isAdd: false,
        param: {
          chapterId: item.chapterId,
          storyId: item.story.storyId,
          title: item.title,
          content: item.content
        }
      }
    });
    if (bsRef?.content?.action) {
      bsRef.content.action.subscribe(() => {
        this.getChapterStory();
      });
    }
  }

  convertAudio(item: any) {
    if (!item.content || item.content.length < 3) {
      this.toastr.error('Nội dung chương không hợp lệ');
      return;
    }
    // create new element p tag
    const p = document.createElement('p');
    // set inner html of p tag
    p.innerHTML = item.content;
    // get inner text of p tag
    let text = p.innerText;
    if (text.length > 5000) {
      text = text.substring(0, 5000);
    }
    const url = 'https://api.fpt.ai/hmi/tts/v5';
    const apiKey = '9x7ROHX9hyRiJxoU5b47zNpK4i780OA8';
    const voice = 'banmai';
    const speed = ''; // Điền giá trị của speed nếu cần
    const headers = new HttpHeaders({
      'api-key': apiKey,
      'voice': voice,
      'speed': speed
    });
    this.spinner.show().then(r => r);
    this.http.post<any>(url, text, {headers})
      .subscribe(
        {
          next: (res: any) => {
            if (res.error === 0) {
              const audioUrl = res.async;
              this.http.patch(`/api/chapter/update-audio`, {
                chapterId: item.chapterId,
                audio: audioUrl
              }).subscribe((res: any) => {
                this.spinner.hide().then(r => r);
                if (res?.status === 'OK') {
                  this.toastr.success('Chuyển đổi audio thành công');
                  this.getChapterStory();
                } else {
                  this.toastr.error('Chuyển đổi audio thất bại');
                }
              })
            } else {
              this.toastr.error('Chuyển đổi audio thất bại');
              this.spinner.hide().then(r => r);
            }
            p.remove();
          },
          error: () => {
            this.toastr.error('Chuyển đổi audio thất bại');
            this.spinner.hide().then(r => r);
            p.remove();
          }
        }
      );
  }
}
