import { Component } from '@angular/core';

@Component({
  selector: 'app-capture',
  templateUrl: './capture.component.html',
  styleUrls: ['./capture.component.scss']
})
export class CaptureComponent {
    start: boolean = true
    openAccordion: string = 'collapseOne';

    // Toggle accordion items
    toggleAccordion(accordionId: string): void {
      this.openAccordion = this.openAccordion === accordionId ? this.openAccordion : accordionId;
    }
  
    // Check if an accordion item is open
    isAccordionOpen(accordionId: string): boolean {
      return this.openAccordion === accordionId;
    }

    toggleStartStop(){
      this.start = !this.start
    }
}
