export interface ArregloPaper {
  id?: number;
  tipoPaper: string;
  idTipoPaper: string;
  idPaper: string;
  titulo: string;
  autores: Autor[];
}

export interface Autor {
  id?: number;
  Nombre1: string;
  Apellido1: string;
  expostor: false;
  paga: false;
}
