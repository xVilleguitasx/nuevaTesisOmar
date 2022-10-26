import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Patrocinador } from '../../../app/models/patrocinador.model';
import { PatrocinadoresService } from '../../../app/services/patrocinadores.service';

@Component({
  selector: 'app-footer-inicio',
  templateUrl: './footer-inicio.component.html',
  styleUrls: ['./footer-inicio.component.css']
})
export class FooterInicioComponent implements OnInit {
  patrocinadores: Patrocinador[]=[];
  URL :  string = environment.api+"/";
  constructor(
    private patrocinadoresService: PatrocinadoresService
  ) { }

  urlglobarlredessociales = './assets/redes-sociales/'



  redessociales=[
  {nombre:this.urlglobarlredessociales+'facebook.png',link:"https://www.facebook.com/sharer/sharer.php?u=https://csei.uta.edu.ec/csei2022"},
  {nombre: this.urlglobarlredessociales+'linkedin.png',link:"https://www.linkedin.com/shareArticle?mini=true&url=https://csei.uta.edu.ec/csei2022"},
  {nombre:this.urlglobarlredessociales+'twitter.png',link:"https://twitter.com/intent/tweet?url=https://csei.uta.edu.ec/csei2022&text="},
  {nombre:this.urlglobarlredessociales+'pinterest.png',link:"https://pinterest.com/pin/create/button/?url=https://csei.uta.edu.ec/csei2022&media=&description="},
  {nombre:this.urlglobarlredessociales+'mail.png',link:"mailto:info@example.com?&subject=&cc=&bcc=&body=https://csei.uta.edu.ec/csei2022%0A"}];



  ngOnInit(): void {
    this.getPatrocinadores();
  }
  getPatrocinadores(){
    this.patrocinadoresService.getPatrocinadores().subscribe((result)=>{
      this.patrocinadores= result.filter(element=> element.estado);
    })
  }
  openPatrocinador(link:string){
    window.open(link, '_blank');
  }

}
