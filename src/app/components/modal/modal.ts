import { Component,input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-modal',
  styleUrl: './modal.scss',
  templateUrl: './modal.html',
})
export class Modal {
  title = input.required<string>();
  isOpen = input<boolean>(false);
  closeModal = output<void>();

  cerrarModal(){
    this.closeModal.emit();
  }
}
