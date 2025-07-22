import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pregunta } from '../../models/Pregunta';
import { RouterModule } from '@angular/router';
import { Respuesta } from '../../models/Respuesta';


@Component({
  selector: 'app-test',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent implements OnInit {
  preguntas: Pregunta[] = [];
  puedeEnviar: boolean = false; // Controla si el botón de enviar está habilitado
  formularioEnviado: boolean = false; // Indica si el formulario ya fue enviado
  testIniciado: boolean = false;
  preguntasCorrectas: number = 0;
  preguntasIncorrectas: number = 35;
  tiempo: string = '45:00'; // Tiempo en formato MM:SS
  tiempoRestante: number = 2700; // 45 minutos en segundos
  private temporizador: any; // Referencia al temporizador
  isVisible: boolean = false; // Controla la visibilidad del botón


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.obtenerPreguntas();
  }

  iniciarTest(): void {
    this.testIniciado = true;
    this.tiempo = '45:00'; // Tiempo en formato MM:SS
    this.preguntasCorrectas = 0;
    this.preguntasIncorrectas = 35;
    this.iniciarTemporizador(); // Cambiado para usar el temporizador
  }

  iniciarTemporizador(): void {
    this.tiempoRestante = 2700; // Reinicia a 45 minutos cada vez que inicia el test
    this.temporizador = setInterval(() => {
      this.tiempoRestante--;
      this.tiempo = this.formatearTiempo(this.tiempoRestante);
    }, 1000); // Decrementa cada segundo
  }

  detenerTemporizador(): void {
    clearInterval(this.temporizador);
  }

  formatearTiempo(segundos: number): string {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${this.agregarCero(minutos)}:${this.agregarCero(segundosRestantes)}`;
  }

  agregarCero(valor: number): string {
    return valor < 10 ? `0${valor}` : `${valor}`;
  }
  obtenerPreguntas(): void {
    this.http.get<Pregunta[]>('/api').subscribe((data) => {
      this.preguntas = data;
      // Inicializar respuestasSeleccionadas en cada pregunta
      this.preguntas.forEach(pregunta => {
        if (!pregunta.respuestasSeleccionadas) {
          pregunta.respuestasSeleccionadas = [];  // Asegúrate de que esté inicializado
        }
      });
      this.actualizarEstadoEnvio(); // Revisar al cargar preguntas
    });
  }


  // Función que guarda las respuestas seleccionadas como texto
  guardarRespuesta(pregunta: Pregunta, respuesta: Respuesta, event: any): void {
    const seleccionada = event.target.checked; // Para checkboxes (o 'true' para radio)
    // Si es una sola respuesta, reemplazar la respuesta seleccionada
    if (seleccionada) {
      pregunta.respuestasSeleccionadas = [respuesta.respuesta]; // Almacenar solo el texto de la respuesta
    } else {
      pregunta.respuestasSeleccionadas = [];
    }

    this.actualizarEstadoEnvio(); // Revisar si todas las preguntas tienen respuesta
  }


  enviarCuestionario(): void {
    if (this.formularioEnviado) {
      return; // Si ya fue enviado, no hace nada
    }

    this.preguntas.forEach(pregunta => {
      const respuestasCorrectas = new Set(pregunta.respuestasCorrectas);
      const respuestasSeleccionadas = new Set(pregunta.respuestasSeleccionadas);


      // Lógica para preguntas de respuesta única
      const [seleccionada] = [...respuestasSeleccionadas];
      pregunta.respuestas.forEach(respuesta => {
        if (respuestasCorrectas.has(respuesta.respuesta)) {
          respuesta.estadoColor = 'correcta'; // Correcta (verde), siempre marcar la respuesta correcta
          respuesta.textoAdicional = '✅ Es correcta';
        } else if (respuesta.respuesta === seleccionada) {
          respuesta.estadoColor = 'incorrecta'; // Incorrecta (rojo)
          respuesta.textoAdicional = '❌ Es incorrecta';
        }
      });

      // Contar preguntas de respuesta única correctas
      pregunta.esCorrecta = respuestasCorrectas.has(seleccionada);
      if (pregunta.esCorrecta) {
        this.preguntasCorrectas++; // Incrementar el contador
      }
    }
    );

    // Deshabilitar el formulario después de enviarlo
    this.formularioEnviado = true;
    this.preguntasIncorrectas = this.preguntasIncorrectas - this.preguntasCorrectas;
    this.detenerTemporizador();

    // Desplazarse al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }






  scrollToPregunta(numero: number) {
    const elemento = document.getElementById(`pregunta${numero}`);
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    this.isVisible = scrollY > 200; // Mostrar si el scroll es mayor a 200px
  }

  scrollToTop(event: Event): void {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToTopSinEvent(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  actualizarEstadoEnvio(): void {
    // Revisar si todas las preguntas tienen al menos una respuesta seleccionada
    this.puedeEnviar = this.preguntas.every(pregunta => pregunta.respuestasSeleccionadas.length > 0);
  }

  reiniciarCuestionario(): void {
    this.formularioEnviado = false;
    this.puedeEnviar = false;
    this.preguntas = []; // Limpia el array para evitar duplicados
    this.obtenerPreguntas(); // Carga nuevas preguntas desde el backend
    this.scrollToTopSinEvent();
    this.iniciarTest();
  }
  
}