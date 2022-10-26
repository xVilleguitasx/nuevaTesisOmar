import { Autor } from "./autor.model";

export interface Autores {
  id?:number;
  paper_id:string;
  ci: string;
  nombre: string;
  tipo: string;
  titulo: string;
  certificado: string;
  autores?: Autor[];
}
