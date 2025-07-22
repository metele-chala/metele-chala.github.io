import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  slides = [
    {
      imageUrl: '../assets/images/slide1.png'
    }
  ];
  
  currentSlide = 0;
  autoSlideInterval: any;
  
  get transformStyle(): string {
    return `translateX(-${this.currentSlide * 100}%)`;
  }

  prevSlide(): void {
    if (this.slides.length > 1) {
      this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    }
  }

  nextSlide(): void {
    if (this.slides.length > 1) {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }
  }

  constructor() {
    if (this.slides.length > 1) {
      this.startAutoSlide();
    }
  }

  startAutoSlide() {
    if (this.slides.length > 1) {
      this.autoSlideInterval = setInterval(() => this.nextSlide(), 15000);
    }
  }

  stopAutoSlide() {
    clearInterval(this.autoSlideInterval);
  }

  restartAutoSlide() {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  onMouseEnter() {
    if (this.slides.length > 1) {
      this.stopAutoSlide();
    }
  }

  onMouseLeave() {
    if (this.slides.length > 1) {
      this.restartAutoSlide();
    }
  }
}
