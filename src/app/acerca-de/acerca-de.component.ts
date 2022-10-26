import { Component, OnInit } from '@angular/core';
import { InfoRegistro } from '../models/infoRegistro.model';
import { InfoRegistroService } from '../services/info-registro.service';

import { environment } from "../../environments/environment";
@Component({
  selector: 'app-acerca-de',
  templateUrl: './acerca-de.component.html',
  styleUrls: ['./acerca-de.component.css']
})
export class AcercaDeComponent implements OnInit {
  images:InfoRegistro[]=[];
  URL: string = environment.api + "/";
  constructor(private infoRegistroService:InfoRegistroService) { }

  ngOnInit(): void {
    
    this.getRegistros();
  }
  getRegistros(){
    this.infoRegistroService.getInfoRegistros().subscribe(registros =>{
      this.images = registros.filter(element => element.estado);
      
    })
  }
}
