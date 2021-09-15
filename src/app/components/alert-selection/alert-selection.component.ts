import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { SkullerudService } from 'src/app/services/skullerud.service';
import { TimeSlot } from 'src/app/types/TimeSlot';

@Component({
  selector: 'app-alert-selection',
  templateUrl: './alert-selection.component.html',
  styleUrls: ['./alert-selection.component.scss']
})
export class AlertSelectionComponent implements OnInit {

  date = new FormControl(new Date());

  selectedTimeSlots = [false,false,false,false,false,false]



  constructor(private skullerudService: SkullerudService,
    private dateAdapter: DateAdapter<Date>) { }

  ngOnInit(): void {
    this.dateAdapter.getFirstDayOfWeek = () => { return 1; }
  }



  async addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    if (event?.value) {
      console.log(event?.value);

      await this.skullerudService.getAviliableSlots(event.value)
    }
  }

}
