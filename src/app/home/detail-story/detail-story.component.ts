import {
  Component,
  OnInit
} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SharedModule} from "../../shared-module";
import {NgOptimizedImage} from "@angular/common";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {
  faCalendar,
  faStar,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-detail-story',
  standalone: true,
  imports: [SharedModule, NgOptimizedImage, FontAwesomeModule, RouterLink],
  templateUrl: './detail-story.component.html',
  styleUrl: './detail-story.component.scss'
})
export class DetailStoryComponent implements OnInit {
  story: any = {};
  date: any = new Date();
  stars: any = [1, 2, 3, 4, 5];

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.getStoryDetail();
  }

  getStoryDetail() {
    const storyId = window.location.href.split('/').pop();
    if (storyId) {
      this.http.get(`/api/stories/detail/${storyId}`)
        .subscribe((res: any) => {
          if (res?.status === 'NOT_FOUND') {
            window.location.href = '/';
          } else {
            this.story = res;
          }
        });
    } else {
      window.location.href = '/';
    }
  }

  protected readonly faUser = faUser;
  protected readonly faCalendar = faCalendar;
  protected readonly faStar = faStar;

  openChapter(chapter: any) {
    window.location.href = `/story/chapter/${chapter.chapterId}`;
  }
}
