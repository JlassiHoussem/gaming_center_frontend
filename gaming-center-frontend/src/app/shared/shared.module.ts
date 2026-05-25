import { NgModule } from '@angular/core';
import { CardComponent } from './components/card.component';
import { ButtonComponent } from './components/button.component';
import { BadgeComponent } from './components/badge.component';
import { ModalComponent } from './components/modal.component';
import { LoadingSpinnerComponent } from './components/loading-spinner.component';

@NgModule({
  imports: [
    CardComponent,
    ButtonComponent,
    BadgeComponent,
    ModalComponent,
    LoadingSpinnerComponent
  ],
  exports: [
    CardComponent,
    ButtonComponent,
    BadgeComponent,
    ModalComponent,
    LoadingSpinnerComponent
  ]
})
export class SharedModule {}
