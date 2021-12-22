import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { SkullerudService } from 'src/app/services/skullerud.service';
import { TimeSlot, Time } from 'src/app/types/TimeSlot';
import { MatChipInputEvent } from '@angular/material/chips';

import { Observable, Subject, Subscription } from 'rxjs';
import { interval } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateTime } from 'luxon';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-alert-selection',
  templateUrl: './alert-selection.component.html',
  styleUrls: ['./alert-selection.component.scss'],
})
export class AlertSelectionComponent implements OnInit {
  date = new FormControl(new Date());
  availableSlots: TimeSlot[] = [];
  searchDate: DateTime = DateTime.now().set({hour: 0, minute: 0});
  availableTimeSlots: TimeSlot[] = [];
  subscription: Subscription | undefined;
  source: Observable<number> | undefined;
  oldSearches: any = [];

  separatorKeysCodes: number[] = [ENTER, COMMA];
  timeSlotCtrl = new FormControl();
  filteredOptions: Observable<string[]> | undefined;
  options: string[] = [];
  allOptions: string[] = Array.from(
    { length: 13 },
    (_v, k) => `${`00${8 + k + 1}`.slice(-2)}:15`
  );

  @ViewChild('timeSlotInput') timeSlotInput:
    | ElementRef<HTMLInputElement>
    | undefined;

  constructor(
    private skullerudService: SkullerudService,
    private dateAdapter: DateAdapter<Date>
  ) {}

  ngOnInit(): void {
    this.dateAdapter.getFirstDayOfWeek = () => {
      return 1;
    };
    this.filteredOptions = this.timeSlotCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) =>
        fruit ? this._filter(fruit) : this.allOptions.slice()
      )
    );
    Notification.requestPermission().then(function (result) {
      console.log(result);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.options.push(value);
    }
    event.chipInput!.clear();
    this.timeSlotCtrl.setValue(null);
  }

  remove(option: string): void {
    const index = this.options.indexOf(option);
    if (index >= 0) {
      this.options.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.options.push(event.option.viewValue);
    this.timeSlotInput!.nativeElement.value = '';
    this.timeSlotCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allOptions.filter((fruit) =>
      fruit.toLowerCase().includes(filterValue)
    );
  }

  async addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    if (event?.value) {
      console.log(event?.value, DateTime.fromJSDate(event.value));
      this.searchDate = DateTime.fromJSDate(event.value);
    }
  }

  private addTime(value: string): Time {
    const time: number[] = value.split(':').map(Number);
    return { hour: time[0], minute: time[1] };
  }

  private validateTime(value: string): boolean {
    const time: number[] = value.split(':').map(Number);
    const dt = DateTime.now().plus({ hours: time[0], minutes: time[1] });
    return (
      time.length === 2 &&
      Number.isInteger(time[0]) &&
      Number.isInteger(time[1]) &&
      dt.isValid
    );
  }

  async check() {
    this.availableSlots = await this.skullerudService.getAviliableSlots(
      this.searchDate.toJSDate()
    );
    const searchForTimeSlots: Time[] = this.options
      .filter((x) => this.validateTime(x))
      .map((x) => this.addTime(x));
    const dts = searchForTimeSlots.map((x) => this.searchDate.plus(x));

    for (const timeSlot of this.availableSlots) {
      for (const dt of dts) {
        if (timeSlot.duration.start < dt && timeSlot.duration.end > dt) {
          this.availableTimeSlots.push(timeSlot);
          this.subscription?.unsubscribe();
        }
      }
    }

    this.availableTimeSlots.forEach((timeSlot) => {
      console.log(
        'Klatring: ',
        timeSlot.duration.start.toISO(),
        ' - ',
        timeSlot.duration.end.toISO()
      );
    });
    if (this.availableTimeSlots.length > 0) {
      const img = '/assets/meme.jpg';
      const text = '¡Oye! La escalada está disponible';
      new Notification('Skullerud klatresenter', {
        body: text,
        icon: img,
      });
    }

    console.log(dts);
  }

  search() {
    this.source = interval(30000);
    this.subscription = this.source.subscribe((val) => {
      console.log(val, 'asd');
      this.oldSearches.push({ number: val, time: DateTime.now() });
      this.check();
    });
  }

  stopInterval() {
    this.subscription?.unsubscribe();
    this.availableTimeSlots = [];
  }
}
