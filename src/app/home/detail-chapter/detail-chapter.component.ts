import {
  Component,
  OnInit
} from '@angular/core';
import {SharedModule} from "../../shared-module";
import {HttpClient} from "@angular/common/http";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-detail-chapter',
  standalone: true,
  imports: [SharedModule, FaIconComponent],
  templateUrl: './detail-chapter.component.html',
  styleUrl: './detail-chapter.component.scss'
})
export class DetailChapterComponent implements OnInit {
  chapter: any = {};
  dateNow: any = new Date();

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.getChapterDetail();
  }

  getChapterDetail() {
    const chapterId = window.location.href.split('/').pop();
    if (chapterId) {
      this.http.get(`/api/chapter/detail/${chapterId}`)
        .subscribe((res: any) => {
          if (res?.status === 'NOT_FOUND') {
            window.location.href = '/';
          } else {
            this.chapter = res;
          }
        });
    } else {
      window.location.href = '/';
    }
  }

  protected readonly faUser = faUser;
}
