import { Component } from '@angular/core';
import { ModalService } from '../../shared/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  constructor(private modalService: ModalService) {}

  openModal(content: any) {
    this.modalService.open();
  }
}
