import {
  Component,
  OnInit
} from '@angular/core';
import {
  HttpClient,
  HttpClientModule
} from "@angular/common/http";
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {
  BsModalService,
  ModalModule
} from "ngx-bootstrap/modal";
import {UpdateStoryComponent} from "./update-story/update-story.component";
import {SharedModule} from "../shared-module";

@Component({
  selector: 'app-story-management',
  standalone: true,
  imports: [SharedModule, NgOptimizedImage, RouterLink],
  providers: [BsModalService],
  templateUrl: './story-management.component.html',
  styleUrl: './story-management.component.scss'
})
export class StoryManagementComponent implements OnInit {
  list: any = [];

  constructor(private http: HttpClient,
              private bsService: BsModalService) {
  }

  ngOnInit(): void {
    this.getListStory();
  }

  getListStory() {
    this.http.get('/api/stories/all')
      .subscribe((res: any) => {
        this.list = res;
      });
  }

  deleteStory(storyId: any) {
    const confirm = window.confirm('Bạn có chắc chắn muốn xóa truyện này không?');
    if (confirm) {
      this.http.delete(`/api/stories/delete/${storyId}`)
        .subscribe((res: any) => {
          this.getListStory();
        });
    }
  }

  openForm() {
    const bsRef = this.bsService.show(UpdateStoryComponent, {
      class: 'modal-lg modal-dialog-centered',
      initialState: {
        title: 'Thêm truyện mới',
        isAdd: true
      }
    });
    if (bsRef?.content?.action) {
      bsRef.content.action.subscribe((res: any) => {
        this.getListStory();
      });
    }
  }

  updateForm(item: any) {
    const bsRef = this.bsService.show(UpdateStoryComponent, {
      class: 'modal-lg modal-dialog-centered',
      initialState: {
        title: 'Cập nhật truyện',
        isAdd: false,
        param: {
          storyId: item.storyId,
          title: item.title,
          author: item.author,
          description: item.description,
        },
        imageSrc: item.coverImage,
        isShowImage: true
      }
    });
    if (bsRef?.content?.action) {
      bsRef.content.action.subscribe((res: any) => {
        this.getListStory();
      });
    }
  }
}
