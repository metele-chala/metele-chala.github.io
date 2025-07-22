import { Respuesta } from "./Respuesta";

export interface Pregunta {
  respuestasCorrectas: string[];
  pregunta: string;
  respuestas: Respuesta[];
  explicacion: string;
  respuestasSeleccionadas: string[];
  esCorrecta?: boolean;
}
