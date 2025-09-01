import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent {
  // Variable que mantiene el índice del ítem abierto
  private openItemIndex: number | null = null;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const item = parseInt(params['item'], 10);
      if (!isNaN(item)) {
        this.openItemIndex = item;
      }
    });
  }
  // Función que abre/cierra los ítems del acordeón
  toggleAccordion(itemIndex: number) {
    this.openItemIndex = this.openItemIndex === itemIndex ? null : itemIndex;
  }

  // Función que determina si un ítem está abierto
  isOpen(itemIndex: number): boolean {
    return this.openItemIndex === itemIndex;
  }

}
