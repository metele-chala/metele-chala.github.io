import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pregunta } from '../../models/Pregunta';
import { RouterModule } from '@angular/router';
import { Respuesta } from '../../models/Respuesta';

@Component({
  selector: 'app-preguntas',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './preguntas.component.html',
  styleUrls: ['./preguntas.component.css'],
})
export class PreguntasComponent implements OnInit {
  preguntas: Pregunta[] = [];
  puedeEnviar: boolean = false;
  formularioEnviado: boolean = false;
  testIniciado: boolean = false;
  preguntasCorrectas: number = 0;
  preguntasIncorrectas: number = 35;
  private temporizador: any;
  isVisible: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerPreguntas();
  }

  iniciarTest(): void {
    this.testIniciado = true;
    this.preguntasCorrectas = 0;
    this.preguntasIncorrectas = 35;
  }

  obtenerPreguntas(): void {
    this.http.get<{ preguntas: any[] }>('assets/files/preguntas.json')
      .subscribe((data) => {
        this.preguntas = data.preguntas.map((p) => {
          let respuestas: Respuesta[] = [];
          let respuestasCorrectas: string[] = [];

          if (p.tipo === 'verdadero_falso') {
            respuestas = [
              { respuesta: 'Verdadero' },
              { respuesta: 'Falso' }
            ];
            respuestasCorrectas = [p.respuesta_correcta ? 'Verdadero' : 'Falso'];
          } else if (p.tipo === 'seleccion_multiple' && p.alternativas) {
            respuestas = Object.entries(p.alternativas).map(([key, value]) => ({
              respuesta: `${key}: ${value}`
            }));
            respuestasCorrectas = [p.respuesta_correcta];
          }

          return {
            pregunta: p.enunciado,
            respuestas,
            explicacion: p.explicacion,
            respuestasCorrectas,
            respuestasSeleccionadas: []
          } as Pregunta;
        });

        this.actualizarEstadoEnvio();
      });
  }

  guardarRespuesta(pregunta: Pregunta, respuesta: Respuesta, event: any): void {
    const seleccionada = event.target.checked;
    if (seleccionada) {
      pregunta.respuestasSeleccionadas = [respuesta.respuesta];
    } else {
      pregunta.respuestasSeleccionadas = [];
    }
    this.actualizarEstadoEnvio();
  }

  enviarCuestionario(): void {
    if (this.formularioEnviado) return;

    this.preguntas.forEach((pregunta) => {
      const respuestasCorrectas = new Set(pregunta.respuestasCorrectas);
      const respuestasSeleccionadas = new Set(pregunta.respuestasSeleccionadas);

      const [seleccionada] = [...respuestasSeleccionadas];
      pregunta.respuestas.forEach((respuesta) => {
        if (respuestasCorrectas.has(respuesta.respuesta) || respuestasCorrectas.has(respuesta.respuesta.charAt(0))) {
          respuesta.estadoColor = 'correcta';
          respuesta.textoAdicional = '✅ Es correcta';
        } else if (respuesta.respuesta === seleccionada) {
          respuesta.estadoColor = 'incorrecta';
          respuesta.textoAdicional = '❌ Es incorrecta';
        }
      });

      pregunta.esCorrecta = respuestasCorrectas.has(seleccionada) || respuestasCorrectas.has(seleccionada?.charAt(0));
      if (pregunta.esCorrecta) {
        this.preguntasCorrectas++;
      }
    });

    this.formularioEnviado = true;
    this.preguntasIncorrectas = this.preguntasIncorrectas - this.preguntasCorrectas;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  actualizarEstadoEnvio(): void {
    this.puedeEnviar = this.preguntas.every((p) => p.respuestasSeleccionadas.length > 0);
  }

  reiniciarCuestionario(): void {
    this.formularioEnviado = false;
    this.puedeEnviar = false;
    this.preguntas = [];
    this.obtenerPreguntas();
    this.iniciarTest();
  }
}
