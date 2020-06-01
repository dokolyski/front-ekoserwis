import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private readonly LIFE_TIME = 5000;

  constructor(private messageService: MessageService) { }

  success(message: string) {
    this.messageService.add({ severity: 'success', life: this.LIFE_TIME, summary: 'Sukces', detail: message });
  }

  info(message: string) {
    this.messageService.add({ severity: 'info', life: this.LIFE_TIME, summary: 'Info', detail: message });
  }

  warn(message: string) {
    this.messageService.add({ severity: 'warn', life: this.LIFE_TIME, summary: 'Warn', detail: message });
  }

  error(message: string) {
    this.messageService.add({ severity: 'error', life: this.LIFE_TIME, summary: 'Error', detail: message });
  }
}
