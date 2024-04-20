import {Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {StoryManagementComponent} from "./story-management/story-management.component";
import {ChapterManagementComponent} from "./chapter-management/chapter-management.component";
import {DetailStoryComponent} from "./home/detail-story/detail-story.component";
import {DetailChapterComponent} from "./home/detail-chapter/detail-chapter.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'story',
    children: [
      {
        path: '',
        component: StoryManagementComponent
      },
      {
        path: 'detail/:id',
        component: DetailStoryComponent
      },
      {
        path: 'chapter/:id',
        component: DetailChapterComponent
      }
    ]
  },
  {
    path: 'chapter',
    component: ChapterManagementComponent
  }

];
