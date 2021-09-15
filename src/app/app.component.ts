import { Component } from '@angular/core';
import { SkullerudService } from './services/skullerud.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'skullerud-klatresenter';

  constructor(private skullerudService: SkullerudService) {}

  async fetchSlots() {
    console.log('fetch clicked!');

    const result = await this.skullerudService.getAviliableSlots(new Date())
    console.log(result);


  }
}
