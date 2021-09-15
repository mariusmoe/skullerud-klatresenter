// Generated by https://quicktype.io

export interface TimeSlot {
  duration:       Duration;
  availableSlots: number;
  capacity:       Capacity[];
}

export interface Capacity {
  resourceId:        number;
  availableCapacity: number;
}

export interface Duration {
  start: string;
  end:   string;
}