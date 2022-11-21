import { Component, OnInit, TemplateRef } from "@angular/core";
import { PersonasService } from "../services/personas.service";
import { Persona } from "../models/persona.model";
import { Identificacion } from "../models/identificacion.model";
import { IdentificacionService } from "../services/identificacion.service";
import { CarrerasService } from "../services/carreras.service";
import { SemestreService } from "../services/semestre.service";
import { Paralelo } from "../models/paralelo.model";
import { ParaleloService } from "../services/paralelo.service";
import { Carrera } from "../models/carrera.model";
import { Semestre } from "../models/semestre.model";
import { Paper } from "../models/paper.model";
import { IdiomaService } from "../services/idioma.service";
import { Idioma } from "../models/idioma.model";
import { PagoService } from "../services/pago.service";
import { Pago } from "../models/pago.model";
import { TipoInscripcionService } from "../services/tipo-inscripcion.service";
import { TipoInscripcion } from "../models/tipoInscripcion.model";
import Swal from "sweetalert2";
import uuid from "uuid-random";
//

import { Inscripcion } from "../models/inscripcion.model";
import { InscripcionService } from "../services/inscripcion.service";
import { Router } from "@angular/router";
import { TipoPaperService } from "../services/tipo-paper.service";
import { PaperService } from "../services/paper.service";
import { PersonaPaper } from "../models/personaPaper.model";
import { ConfiguracionService } from "../services/configuracion.service";
import { MailerService } from "../services/mailer.service";
import { InformacionCongresoService } from "../services/informacion-congreso.service";
import { InformacionCongreso } from "../models/informacionCongreso.model";
import { Autor } from "../models/autor.model";
import { AutoresService } from "../services/autores.service";
import { environment } from "../../environments/environment";
import * as crypto from "crypto-js";
import { element } from "protractor";
@Component({
  selector: "app-registro",
  templateUrl: "./registro.component.html",
  styleUrls: ["./registro.component.css"],
})
export class RegistroComponent implements OnInit {
  idInscripcion: string;
  personaGuardar: Persona;
  inscripcionGuardar: Inscripcion;
  paperGuardar: PersonaPaper;
  /* Datos del formulario  */
  identificaciones: Identificacion[] = [];
  tipoIdentificacion: string = "Seleccione...";
  carreras: Carrera[] = [];
  link: string = "https://integracion.alignetsac.com/";
  tipoCarrera: string = "Seleccione...";
  semestres: Semestre[] = [];
  tipoSemestre: string = "Seleccione...";
  paralelos: Paralelo[] = [];
  tipoParalelo: string = "Seleccione...";
  costo = 0;
  papers: Paper[] = [];
  tipoPaper: string = "Seleccione...";
  pagos: Pago[] = [];
  tipoPago: string = "Seleccione...";
  inscripciones: TipoInscripcion[] = [];
  tipoInscripcion: string = "Seleccione...";
  idiomas: Idioma[] = [];
  tipoIdioma: string = "Seleccione...";
  /* Datos de combo */
  tipoEstudiante = false;
  tipoAutor = false;
  /* Form de pago a mostrar */
  pagoEfectivo = false;
  pagoTarjeta = false;
  metodoPago = 1;
  cedulaImcompleta: boolean = false;
  /* Variables Form */
  idPersona: string;
  idtipoDocumentoIdentidad: number = null;
  documentoIdentidad: string = "";
  nombres: string = "";
  apellidos: string = "";
  direccion: string = "";
  idTipoInscripcion: number;
  idTipoPaper: number;
  tituloDelPaper: string = "";
  idPaper: string;
  idCarrera: number;
  idSemestre: number;
  idParalelo: number;
  idTipoPago: number;
  telefono: string = "";
  email: string = "";
  idLenguaje: number;
  mostrarToas: boolean;
  inscripcionExiste: boolean = false;
  personaExiste: string = "";
  autoresEliminar: string[] = [];
  paperEliminar: string[] = [];
  infoCongreso: InformacionCongreso = {
    id: 1,
    nombre: "",
    titulo: "",
    fecha: "",
    logo: "",
  };

  precioFinal = 0;
  autores = [];

  arrayPapers = [];
  agregarPaper() {
    this.arrayPapers.push({
      id: null,
      tipoPaper: "Seleccione...",
      idTipoPaper: 1,
      idPaper: "",
      titulo: "",
      autores: [],
    });
    this.agregarAutorPrincipal();
  }
  eliminarPaper(index: number) {
    if (
      this.arrayPapers[index].id != null &&
      this.arrayPapers[index].id != undefined
    ) {
      this.paperEliminar.push(this.arrayPapers[index].id);
      this.arrayPapers[index].autores.forEach((element) => {
        this.autoresEliminar.push(element.id);
      });
    }
    this.arrayPapers.splice(index, 1);
  }
  agregarAutor(index: number) {
    this.arrayPapers[index].autores.push({
      id: null,
      Nombre1: "",
      Apellido1: "",
      expositor: false,
      paga: false,
    });
    this.agregarAutorPrincipal();
  }

  agregarAutorPrincipal() {
    this.arrayPapers.forEach((paper) => {
      if (paper.autores.length === 0) {
        paper.autores.push({
          id: null,
          Nombre1: this.nombres,
          Apellido1: this.apellidos,
          expositor: true,
          paga: true,
        });
      } else {
        paper.autores[0] = {
          id: paper.autores[0].id,
          Nombre1: this.nombres,
          Apellido1: this.apellidos,
          expositor: paper.autores[0].expositor,
          paga: true,
        };
      }
    });
  }
  constructor(
    private personaService: PersonasService,
    private identificacionService: IdentificacionService,
    private carreraService: CarrerasService,
    private semestreService: SemestreService,
    private paraleloService: ParaleloService,
    private tipoPaperService: TipoPaperService,
    private idiomaService: IdiomaService,
    private pagoService: PagoService,
    private tipoInscripcionService: TipoInscripcionService,
    private inscripcionService: InscripcionService,
    private paperService: PaperService,
    private router: Router,
    private configService: ConfiguracionService,
    private _mailerService: MailerService,
    private _informacionCongresoService: InformacionCongresoService,
    private _autoresService: AutoresService
  ) {}

  registroID: boolean = true;
  registroForm: boolean = false;
  registroPago: boolean = false;
  cedulaCorrecta: boolean = true;
  mailValido: boolean = true;
  persona: Persona = {};
  ngOnInit(): void {
    /* Cargar tipo de identificacion */
    this.habiliar();
    this.CargarDatosCombos();
    this.getInformacionCongreso();
  }
  cambiarEstadoExpositor(autores: any, index: number) {
    const val = autores[index].expositor;
    autores.forEach((element) => {
      element.expositor = false;
    });
    autores[index].expositor = !val;
  }

  habiliar() {
    this.configService.getConf().subscribe((result) => {
      result.forEach((element) => {
        if (element.nombre === "Registro") {
          if (!element.estado) {
            this.router.navigate(["/acerca-de"]);
          }
        }
      });
    });
  }

  getInformacionCongreso() {
    this._informacionCongresoService.getInfoAll().subscribe((result) => {
      this.infoCongreso = result[0];
    });
  }
  CargarDatosCombos() {
    this.CargarIdentificacion();
    this.CargarCarreras();
    this.CargarSemestres();
    this.CargarParalelos();
    this.cargarPapers();
    this.CargarIdiomas();
    this.CargarPagos();
    this.CargarTipoInscripcion();
  }
  async CargarTipoInscripcion() {
    await this.tipoInscripcionService
      .getTipoInscripciones()
      .subscribe((result) => {
        this.inscripciones = result.filter((element) => element.estado);
      });
  }
  async CargarPagos() {
    await this.pagoService.getPagos().subscribe((result) => {
      this.pagos = result;
    });
  }
  async CargarIdiomas() {
    await this.idiomaService.getIdiomas().subscribe((result) => {
      this.idiomas = result;
    });
  }
  async cargarPapers() {
    await this.tipoPaperService.getPapers().subscribe((result) => {
      this.papers = result.filter((element) => element.estado);
    });
  }
  async CargarParalelos() {
    await this.paraleloService.getParalelos().subscribe((result) => {
      this.paralelos = result;
    });
  }
  async CargarSemestres() {
    await this.semestreService.getSemestres().subscribe((result) => {
      this.semestres = result.filter((element) => element.estado);
    });
  }
  async CargarCarreras() {
    await this.carreraService.getCarreras().subscribe((result) => {
      this.carreras = result.filter((element) => element.estado);
    });
  }

  async CargarIdentificacion() {
    await this.identificacionService
      .getIdentificaciones()
      .subscribe((result) => {
        this.identificaciones = result;
      });
  }
  /* Cambiar Datos */
  CambiarParalelo(val: Paralelo): void {
    this.tipoParalelo = val.nombre;
    this.idParalelo = val.id;
  }

  CambiarDocumento(val: Identificacion): void {
    this.tipoIdentificacion = val.nombre;
    this.idtipoDocumentoIdentidad = val.id;
  }
  CambiarSemestre(val: Semestre): void {
    this.tipoSemestre = val.semestre;
    this.idSemestre = val.id;
  }
  CambiarPaper(val: any, index: number): void {
    this.arrayPapers[index].tipoPaper = val.tipo;
    this.arrayPapers[index].idTipoPaper = val.id;
  }
  CambiarCarrera(val: Carrera): void {
    this.tipoCarrera = val.carrera;
    this.idCarrera = val.id;
  }
  CambiarLenguaje(val: Idioma): void {
    this.tipoIdioma = val.idioma;
    this.idLenguaje = val.id;
  }
  CambiarInscripcion(val: TipoInscripcion) {
    this.idTipoInscripcion = val.id;
    this.tipoInscripcion = val.nom_inscr;
    if (this.tipoInscripcion === "STUDENT") {
      this.tipoEstudiante = true;
      this.tipoAutor = false;
      this.autores = [];
    } else if (
      this.tipoInscripcion === "AUTHOR" ||
      this.tipoInscripcion === "AUTHOR UTA"
    ) {
      this.tipoEstudiante = false;
      this.tipoAutor = true;
      if (this.arrayPapers.length === 0) {
        this.agregarPaper();
      }
    } else {
      this.tipoEstudiante = false;
      this.tipoAutor = false;
      this.arrayPapers = [];
    }
    this.inscripciones.forEach((element) => {
      if (element.nom_inscr === this.tipoInscripcion) {
        this.costo = element.costo;
        this.precioFinal = this.costo;
      }
    });
  }

  CambiarMetodoPago(val: number) {
    this.metodoPago = val;
  }
  pago() {
    this.registroPago = false;
    if (this.metodoPago == 1) {
      this.idTipoPago = 1;
      this.pagoEfectivo = true;
      this.pagoTarjeta = false;
    } else {
      this.idTipoPago = 2;
      this.pagoEfectivo = false;
      this.pagoTarjeta = true;
    }
  }
  retornarPago() {
    this.pagoTarjeta = false;
    this.pagoEfectivo = false;
    this.registroPago = true;
  }

  MensajeFin(titulo: string, texto: string) {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: "success",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#7A1E19",
      iconColor: "#7A1E19",
      color: "#7A1E19",
    });
  }
  MensajeInfo(titulo: string, texto: string) {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: "info",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#7A1E19",
      iconColor: "#7A1E19",
      color: "#7A1E19",
    });
  }
  cambiarForm(form: string) {
    if (form === "registroID") {
      this.registroID = true;
      this.registroForm = false;
      this.registroPago = false;
      this.RestablecerDatos();
    } else if (form === "registroForm") {
      if (this.documentoIdentidad.length != 0) {
        this.CargarDatos();
        this.registroID = false;
        this.registroForm = true;
        this.registroPago = false;
      } else {
        this.cedulaImcompleta = true;
        setTimeout(() => {
          this.cedulaImcompleta = false;
        }, 3000);
      }
    } else if (form === "registroPago") {
      this.registroID = false;
      this.registroForm = false;
      this.registroPago = true;
    }
  }
  verificarDatosRegistro(): boolean {
    this.validarCedula();
    this.validarEmail();
    if (
      this.idtipoDocumentoIdentidad != null &&
      this.documentoIdentidad != "" &&
      this.nombres != "" &&
      this.apellidos != "" &&
      this.direccion != "" &&
      this.email != "" &&
      this.telefono != "" &&
      this.idLenguaje != null &&
      this.mailValido
    ) {
      if (this.idTipoInscripcion === 1 || this.idTipoInscripcion === 4) {
        this.idCarrera = null;
        this.idParalelo = null;
        this.idSemestre = null;
        return true;
      } else if (this.idTipoInscripcion === 3) {
        if (
          this.idCarrera != null &&
          this.idParalelo != null &&
          this.idSemestre != null
        ) {
          this.idPaper = null;
          this.idTipoPaper = null;
          return true;
        }
      } else if (this.idTipoInscripcion === 2) {
        this.idCarrera = null;
        this.idParalelo = null;
        this.idSemestre = null;
        this.idPaper = null;
        this.idTipoPaper = null;
        return true;
      }
    }

    return false;
  }
  eliminarAutor(paper: any, index: number) {
    if (
      paper.autores[index].id != null &&
      paper.autores[index].id != undefined
    ) {
      this.autoresEliminar.push(paper.autores[index].id);
    }

    paper.autores.splice(index, 1);
  }
  async CargarDatos() {
    this.inscripcionExiste = false;
    this.datosCargados = false;
    return await this.personaService
      .getPersona(this.documentoIdentidad)
      .subscribe(
        (result) => {
          this.persona = result;
          this.inscripcionService.getInscripcion(result.id).subscribe(
            (result) => {
              this.tipoIdioma = this.idiomas[result.id_idioma - 1].idioma;
              this.idLenguaje = result.id_idioma;
              //
              this.idInscripcion = result.id;
              if (
                this.persona.id_tip_ins_pert === 1 ||
                this.persona.id_tip_ins_pert === 4
              ) {
               
                this.paperService
                  .getPaper(this.idInscripcion)
                  .subscribe((result) => {
                    result.forEach((paper) => {
                      this._autoresService
                        .getAutoresPaper(paper.id)
                        .subscribe((result) => {
                          let tipoPaper = "";
                          this.papers.forEach((element) => {
                            if (element.id === paper.id_tipopaper) {
                              tipoPaper = element.tipo;
                            }
                          });
                          this.arrayPapers.push({
                            id: paper.id,
                            tipoPaper: tipoPaper,
                            idTipoPaper: paper.id_tipopaper,
                            idPaper: paper.id_paper,
                            titulo: paper.titulo,
                            autores: result,
                          });
                        });
                    });
                  });
              }
              this.incripcionExistente();
            },
            (err) => {
              this.datosCargados = true;
            }
          );
          setTimeout(() => {
            if (this.persona.id != undefined) {
              this.idPersona = this.persona.id;
              this.documentoIdentidad = this.persona.documento_identificacion;
              this.personaExiste = this.persona.documento_identificacion;
              this.nombres =
                this.persona.nom_paterno +
                " " +
                (this.persona.nom_materno != null
                  ? this.persona.nom_materno
                  : "");
              this.apellidos =
                this.persona.ape_paterno +
                " " +
                (this.persona.ape_materno != null
                  ? this.persona.ape_materno
                  : "");
              this.direccion =
                this.persona.direccion != null ? this.persona.direccion : "";
              this.email = this.persona.email != null ? this.persona.email : "";
              this.telefono =
                this.persona.celular != null ? this.persona.celular : "";
             
              this.tipoInscripcion =
                this.inscripciones[this.persona.id_tip_ins_pert - 1].nom_inscr;
              this.idTipoInscripcion = this.persona.id_tip_ins_pert;

              if (this.persona.id_tip_ins_pert == 3) {
                this.tipoEstudiante = true;
                this.carreras.forEach((element) => {
                  if (element.id === this.persona.id_carrera_per) {
                    this.tipoCarrera = element.carrera;
                    this.idCarrera = element.id;
                  }
                });

                this.semestres.forEach((element) => {
                  if (element.id === this.persona.id_semestre_per) {
                    this.tipoSemestre = element.semestre;
                    this.idSemestre = element.id;
                  }
                });
                this.paralelos.forEach((element) => {
                  if (element.id === this.persona.id_paralelo_per) {
                    this.tipoParalelo = element.nombre;
                    this.idParalelo = element.id;
                  }
                });
              }
              if (
                this.persona.id_tip_ins_pert === 1 ||
                this.persona.id_tip_ins_pert === 4
              ) {
                this.tipoAutor = true;
              }
              if (this.identificaciones[0].id === this.persona.id_tip_pert) {
                this.tipoIdentificacion = this.identificaciones[0].nombre;
                this.idtipoDocumentoIdentidad = this.identificaciones[0].id;
              } else {
                this.tipoIdentificacion = this.identificaciones[1].nombre;
                this.idtipoDocumentoIdentidad = this.identificaciones[1].id;
              }
              this.inscripciones.forEach((element) => {
                if (element.nom_inscr === this.tipoInscripcion) {
                  this.costo = element.costo;
                }
              });
            } else {
              this.RestablecerDatos();
            }
            this.datosCargados = true;
          }, 3000);
        },
        (err) => {
          this.datosCargados = true;
        }
      );
  }
  datosCargados = false;
  incripcionExistente() {
    Swal.fire({
      title:
        "Este usuario ya se encuentra registrado / This user is already registered",
      text: "¿Deseas editar los datos? / Do you want to edit the data?",
      icon: "info",
      iconColor: "#7A1E19",
      color: "#7A1E19",
      showCancelButton: true,
      confirmButtonColor: "#7A1E19",
      cancelButtonColor: "#85929E",
      confirmButtonText: "SI",
      cancelButtonText: "NO",
    }).then((result) => {
      if (result.value) {
        this.inscripcionExiste = true;
        
      } else {
        this.cambiarForm("registroID");
        this.RestablecerDatos();
      }
    });
  }
  RestablecerDatos() {
    this.datosCargados = true;
    this.tipoEstudiante = false;
    this.tipoAutor = false;
    this.idPersona = null;
    this.documentoIdentidad="";
    this.idtipoDocumentoIdentidad = 1;
    this.documentoIdentidad = "";
    this.nombres = null;
    this.apellidos = null;
    this.direccion = null;
    this.idTipoInscripcion = null;
    this.idTipoPaper = null;
    this.idPaper = null;
    this.idCarrera = null;
    this.idSemestre = null;
    this.idParalelo = null;
    this.idTipoPago = null;
    this.telefono = "";
    this.email = "";
    this.idLenguaje = null;
    this.inscripcionExiste = false;
    this.personaExiste = "";
    this.tipoInscripcion = "Seleccione...";
    this.tipoCarrera = "Seleccione...";
    this.tipoPaper = "Seleccione...";
    this.tipoSemestre = "Seleccione...";
    this.tipoParalelo = "Seleccione...";
    this.idInscripcion = null;
    this.arrayPapers = [];
  }
  validarCedula() {
    // Preguntamos si la cedula consta de 10 digitos
    if (this.documentoIdentidad.length === 10) {
      // Obtenemos el digito de la region que sonlos dos primeros digitos
      const digitoRegion = this.documentoIdentidad.substring(0, 2);

      // Pregunto si la region existe ecuador se divide en 24 regiones
      if (digitoRegion >= String(1) && digitoRegion <= String(24)) {
        // Extraigo el ultimo digito
        const ultimoDigito = Number(this.documentoIdentidad.substring(9, 10));

        // Agrupo todos los pares y los sumo
        const pares =
          Number(this.documentoIdentidad.substring(1, 2)) +
          Number(this.documentoIdentidad.substring(3, 4)) +
          Number(this.documentoIdentidad.substring(5, 6)) +
          Number(this.documentoIdentidad.substring(7, 8));

        // Agrupo los impares, los multiplico por un factor de 2, si la resultante es > que 9 le restamos el 9 a la resultante
        let numeroUno: any = this.documentoIdentidad.substring(0, 1);
        numeroUno = numeroUno * 2;
        if (numeroUno > 9) {
          numeroUno = numeroUno - 9;
        }

        let numeroTres: any = this.documentoIdentidad.substring(2, 3);
        numeroTres = numeroTres * 2;
        if (numeroTres > 9) {
          numeroTres = numeroTres - 9;
        }

        let numeroCinco: any = this.documentoIdentidad.substring(4, 5);
        numeroCinco = numeroCinco * 2;
        if (numeroCinco > 9) {
          numeroCinco = numeroCinco - 9;
        }

        let numeroSiete: any = this.documentoIdentidad.substring(6, 7);
        numeroSiete = numeroSiete * 2;
        if (numeroSiete > 9) {
          numeroSiete = numeroSiete - 9;
        }

        let numeroNueve: any = this.documentoIdentidad.substring(8, 9);
        numeroNueve = numeroNueve * 2;
        if (numeroNueve > 9) {
          numeroNueve = numeroNueve - 9;
        }

        const impares =
          numeroUno + numeroTres + numeroCinco + numeroSiete + numeroNueve;

        // Suma total
        const sumaTotal = pares + impares;

        // extraemos el primero digito
        const primerDigitoSuma = String(sumaTotal).substring(0, 1);

        // Obtenemos la decena inmediata
        const decena = (Number(primerDigitoSuma) + 1) * 10;

        // Obtenemos la resta de la decena inmediata - la suma_total esto nos da el digito validador
        let digitoValidador = decena - sumaTotal;

        // Si el digito validador es = a 10 toma el valor de 0
        if (digitoValidador === 10) {
          digitoValidador = 0;
        }

        // Validamos que el digito validador sea igual al de la cedula
        if (digitoValidador === ultimoDigito) {
          this.cedulaCorrecta = true;
        } else {
          this.cedulaCorrecta = false;
        }
      } else {
        // imprimimos en consola si la region no pertenece
        this.cedulaCorrecta = false;
      }
    } else {
      // Imprimimos en consola si la cedula tiene mas o menos de 10 digitos
      if (this.idtipoDocumentoIdentidad === 1) {
        this.cedulaCorrecta = false;
      } else {
        this.cedulaCorrecta = true;
      }
    }
  }
  validarEmail() {
    var EMAIL_REGEX =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.email.match(EMAIL_REGEX)) {
      this.mailValido = true;
    } else {
      this.mailValido = false;
    }
  }

  async guardarDatos() {
    try {
      this.guardarInscripcion();
    } catch (error) {}
  }
  async guardarPersona() {
    if (this.idTipoInscripcion === 1 || this.idTipoInscripcion === 4) {
      this.precioFinal = this.arrayPapers.length * this.costo;
    } else {
      this.precioFinal = this.costo;
    }

    if (this.idTipoInscripcion === 1 || this.idTipoInscripcion === 4) {
      let cont = 0;
      this.arrayPapers.forEach((paper) => {
        if (
          paper.titulo === "" ||
          paper.id_tipopaper === "" ||
          paper.idPaper === "" ||
          paper.autores === 0
        ) {
          this.mostrarToas = true;
        } else {
          this.mostrarToas = false;
        }

        paper.autores.forEach((autor) => {
          if (autor.Nombre1 != "" && autor.Apellido1 != "") {
            if (autor.expositor) {
              cont++;
            }
          }
        });
      });
      if (this.mostrarToas) {
        return;
      }
      if (cont < this.arrayPapers.length) {
        this.MensajeInfo(
          "Advertencia / Warning",
          "Se debe seleccionar al menos a un expositor / At least one exhibitor must be selected."
        );
        return;
      }
    }
    if (this.verificarDatosRegistro()) {
      let divNombre = this.nombres.split(" ");
      let divApellido = this.apellidos.split(" ");
      divNombre[1] === undefined ? (divNombre[1] = "") : "";
      divApellido[1] === undefined ? (divApellido[1] = "") : "";
      this.personaGuardar = {
        nom_paterno: divNombre[0],
        nom_materno: divNombre[1],
        ape_paterno: divApellido[0],
        ape_materno: divApellido[1],
        documento_identificacion: this.documentoIdentidad,
        direccion: this.direccion,
        email: this.email,
        celular: this.telefono,
        id_tip_ins_pert: this.idTipoInscripcion,
        id_tip_pert: this.idtipoDocumentoIdentidad,
        id_carrera_per: this.idCarrera,
        id_semestre_per: this.idSemestre,
        id_paralelo_per: this.idParalelo,
      };

      if (this.idPersona !== undefined && this.idPersona !== null) {
        if (this.personaExiste === this.documentoIdentidad) {
          this.personaGuardar.id = this.idPersona;
          this.personaService
            .editPersona(this.idPersona, this.personaGuardar)
            .subscribe((result) => {
              const lenguaje = {
                id_idioma: this.idLenguaje,
                monto: String(this.precioFinal),
              };
              this.inscripcionService
                .editInscripcion(this.idPersona, lenguaje)
                .subscribe((result) => {});
              if (this.inscripcionExiste) {
                if (
                  this.idTipoInscripcion === 1 ||
                  this.idTipoInscripcion === 4
                ) {
                  this.autoresEliminar.forEach((element) => {
                    this._autoresService.deleteAutor(element).subscribe();
                  });

                  this.paperEliminar.forEach((element) => {
                    this.paperService.deletepaper(element).subscribe();
                  });

                  for (let i = 0; i < this.arrayPapers.length; i++) {
                    if (this.arrayPapers[i].id === null) {
                      this.paperGuardar = {
                        id_inscripcion: this.idInscripcion,
                        id_paper: this.arrayPapers[i].idPaper.toString(),
                        id_tipopaper: this.arrayPapers[i].idTipoPaper,
                        titulo: this.arrayPapers[i].titulo,
                      };
                      this.paperService
                        .insertPaper(this.paperGuardar)
                        .subscribe((result) => {
                          for (
                            let j = 0;
                            j < this.arrayPapers[i].autores.length;
                            j++
                          ) {
                            if (
                              this.arrayPapers[i].autores[j].Nombre1 != "" &&
                              this.arrayPapers[i].autores[j].Apellido1 != ""
                            ) {
                              const enviar = {
                                id_paper_per: result[i].id,
                                Nombre1: this.arrayPapers[i].autores[j].Nombre1,
                                Apellido1:
                                  this.arrayPapers[i].autores[j].Apellido1,
                                expositor:
                                  this.arrayPapers[i].autores[j].expositor,
                                paga: this.arrayPapers[i].autores[j].paga,
                              };

                              this._autoresService
                                .insertAutor(enviar)
                                .subscribe(() => {});
                            }
                          }
                        });
                    } else {
                      this.paperGuardar = {
                        id: this.arrayPapers[i].id,
                        id_paper: this.arrayPapers[i].idPaper.toString(),
                        id_tipopaper: this.arrayPapers[i].idTipoPaper,
                        titulo: this.arrayPapers[i].titulo,
                      };
                      this.paperService
                        .updatePaper(this.paperGuardar)
                        .subscribe((result) => {
                          for (
                            let j = 0;
                            j < this.arrayPapers[i].autores.length;
                            j++
                          ) {
                            if (
                              this.arrayPapers[i].autores[j].Nombre1 != "" &&
                              this.arrayPapers[i].autores[j].Apellido1 != ""
                            ) {
                              if (this.arrayPapers[i].autores[j].id != null) {
                                this._autoresService
                                  .actulizarAutor(
                                    this.arrayPapers[i].autores[j]
                                  )
                                  .subscribe();
                              } else {
                                const enviar = {
                                  id_paper_per: this.arrayPapers[i].id,
                                  Nombre1:
                                    this.arrayPapers[i].autores[j].Nombre1,
                                  Apellido1:
                                    this.arrayPapers[i].autores[j].Apellido1,
                                  expositor:
                                    this.arrayPapers[i].autores[j].expositor,
                                  paga: this.arrayPapers[i].autores[j].paga,
                                };

                                this._autoresService
                                  .insertAutor(enviar)
                                  .subscribe(() => {});
                              }
                            }
                          }
                        });
                    }
                  }

                  const mail = {
                    nombre: this.nombres + " " + this.apellidos,
                    ci: this.documentoIdentidad,
                    monto: this.precioFinal,
                    destinatario: this.email,
                    titulo: this.infoCongreso.titulo,
                    fecha: this.infoCongreso.fecha,
                    edicion: this.infoCongreso.nombre,
                    idioma: this.tipoIdioma,
                  };
                  this._mailerService
                    .mailRegistro(mail)
                    .subscribe((result) => {});
                }

                this.router.navigate(["/acerca-de"]);
                this.MensajeFin(
                  "Actualización de datos!",
                  "Sus datos han sido actualizados."
                );
              } else {
                this.cambiarForm("registroPago");
              }
            });
        } else {
          /* Mensaje */
          this.MensajeInfo(
            "El documento de identidad no coincide con los datos / The identity document does not match the data.",
            "Por favor revisa el documento de identidad ingresado / Please check the identity document entered. "
          );
          return;
        }
      } else {
        await this.personaService
          .getPersona(this.documentoIdentidad)
          .subscribe((result) => {
            /* Mensaje */
            this.MensajeInfo(
              "El documento de identidad ya se encuentra registrado / The identity document is already registered.",
              "Por favor revisa el documento de identidad ingresado / Please check the identity document entered."
            );
            this.router.navigate(["/registro"]);
            return;
          });
        await this.personaService
          .insertPersona(this.personaGuardar)
          .subscribe((result) => {
            this.idPersona = result[0].id;
            this.cambiarForm("registroPago");
          });
      }
    } else {
      this.mostrarToas = true;
      setTimeout(() => {
        this.mostrarToas = false;
      }, 5000);
    }
  }
  async guardarInscripcion() {
    var interval = setInterval(function () {
      if (this.idPersona !== "") {
        clearInterval(interval);
      }
    }, 2000);
    const fecha = new Date();

    this.inscripcionGuardar = {
      id_per_pert: this.idPersona,
      id_tipopago: this.idTipoPago,
      cod_pago: null,
      resultado_autorizacion: null,
      codigo_autorizacion: null,
      foto_deposito: null,
      fecha_inscripcion:
        fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDay(),
      estado: "NV",
      num_deposito: null,
      id_idioma: this.idLenguaje,
      fecha_Registro_de_validacion: null,
      Hora_Registro_Deposito: null,
      Hora_Validacion_Deposito: null,
      fecha_validacion_deposito: null,
      monto: String(this.precioFinal),
      Hora_Inscripcion:
        fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds(),
    };

    await this.inscripcionService
      .insertInscripcion(this.inscripcionGuardar)
      .subscribe((result) => {
        this.idInscripcion = result[0].id;

        if (this.idTipoInscripcion === 1 || this.idTipoInscripcion === 4) {
          for (let i = 0; i < this.arrayPapers.length; i++) {
            this.paperGuardar = {
              id_inscripcion: this.idInscripcion,
              id_paper: this.arrayPapers[i].idPaper.toString(),
              id_tipopaper: this.arrayPapers[i].idTipoPaper,
              titulo: this.arrayPapers[i].titulo,
            };
            this.paperService
              .insertPaper(this.paperGuardar)
              .subscribe((result) => {
                for (let j = 0; j < this.arrayPapers[i].autores.length; j++) {
                  if (
                    this.arrayPapers[i].autores[j].Nombre1 != "" &&
                    this.arrayPapers[i].autores[j].Apellido1 != ""
                  ) {
                    const enviar = {
                      id_paper_per: result[i].id,
                      Nombre1: this.arrayPapers[i].autores[j].Nombre1,
                      Apellido1: this.arrayPapers[i].autores[j].Apellido1,
                      expositor: this.arrayPapers[i].autores[j].expositor,
                      paga: this.arrayPapers[i].autores[j].paga,
                    };

                    this._autoresService
                      .insertAutor(enviar)
                      .subscribe(() => {});
                  }
                }
              });
          }
        }

        this.router.navigate(["/acerca-de"]);
        this.MensajeFin(
          "Registro exitoso! / Successful Registation",
          "Su registro fue procesado exitosamente. Recuerde revisar su correo y validar su inscripción/ Remember to check your email and validate your registration."
        );

        const mail = {
          nombre: this.nombres + " " + this.apellidos,
          ci: this.documentoIdentidad,
          monto: this.precioFinal,
          destinatario: this.email,
          titulo: this.infoCongreso.titulo,
          fecha: this.infoCongreso.fecha,
          edicion: this.infoCongreso.nombre,
          idioma: this.tipoIdioma,
        };
        this._mailerService.mailRegistro(mail).subscribe((result) => {});
      });
  }
}
