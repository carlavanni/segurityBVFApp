import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuariosService } from '../services/usuarios.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  cliente=[];
  alt = [];
  endereco = [];

  constructor(
    public alertController: AlertController,
    private usuarioService: UsuariosService,
    private router: Router,
    public navCtrl: NavController
 ) {}

  async ionViewWillEnter(){
    const usuarioLogado = await this.usuarioService.buscarUsuarioLogado();
    if(!usuarioLogado){
      this.router.navigateByUrl('/login');
    
    }
  }

  async exibirAlertLogout() {
    const alert = await this.alertController.create({
      header: 'Confirmação!',
      message: 'Deseja realmente sair?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        }, {
          text: 'Sim, desejo sair',
          handler: () => {
            this.usuarioService.removerUsuarioLogado();
            this.router.navigateByUrl('/login')
          }
        }
      ]
    });

    await alert.present();
  }

}


