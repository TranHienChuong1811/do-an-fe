import {
  Component,
  OnInit
} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SharedModule} from "../shared-module";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule, NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  listStory: any = [];

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.getListStory();
  }

  private getListStory() {
    this.http.get('/api/stories/all')
      .subscribe((res: any) => {
        this.listStory = res;
      });
  }
}
