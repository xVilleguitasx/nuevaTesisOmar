import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-administracion",
  templateUrl: "./administracion.component.html",
  styleUrls: ["./administracion.component.css"],
})
export class AdministracionComponent implements OnInit {
  constructor(private _authService: AuthService, private _router: Router) {}
  errorLogin = false;
  errroMostrar = false;
  errorUsuario = false;
  errorPass = false;
  active = 1;
  usuario = "";
  pass = "";
  ngOnInit(): void {}
  login() {
    if (this.usuario.length < 1) {
      this.errorUsuario = true;
      return;
    }else{
      this.errorUsuario=false;
    }
    if (this.pass.length < 1) {
      this.errorPass = true;
      return;
    }else{
      this.errorPass=false;
    }
    let user = {
      user: this.usuario,
      pass: this.pass,
    };

    this.errorLogin = true;
    this._authService.auth(user).subscribe((result) => {
      this._router.navigate(["/admin/tablero"]);
    });
    setTimeout(() => {
      this.errorLogin = false;
      this.errroMostrar = true;
      setTimeout(() => {
        this.errroMostrar = false;
      }, 3000);
    }, 2000);
  }
}
