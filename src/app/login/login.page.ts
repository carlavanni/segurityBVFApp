import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  
  public formLogin: FormGroup;

  public mensagens_validacao = {
    email: [
    {tipo: 'required', mensagem: 'O campo e-mail é obrigatório!'},
    {tipo: 'email', mensagem: 'E-mail inválido!'}
    ],
    senha: [
      {tipo: 'required', mensagem: 'O campo senha é obrigatório!'},
      {tipo: 'minlength', mensagem: 'A senha deve ter pelo menos 6 caracteres!'}
    ]
  };

  constructor(private formBuilder: FormBuilder, private router: Router,
    private usuarioService: UsuariosService, public toastController: ToastController, 
    public alertController: AlertController) {
    this.formLogin = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      senha: ['', Validators.compose([Validators.required, Validators.minLength(6) ])],
      manterLogado : [false]
    });
   }

  ngOnInit() {
  }
  async ionViewWillEnter(){
const usuarioLogado = await this.usuarioService.buscarUsuarioLogado();
if(usuarioLogado && usuarioLogado.manterLogado){
  this.router.navigateByUrl('/home');
  this.presentToast();

}
  }

  public async login (){
    if(this.formLogin.valid){
      const usuario = await this.usuarioService.login(this.formLogin.value.email, 
        this.formLogin.value.senha);

      if(usuario){
        usuario.manterLogado = this.formLogin.value.manterLogado;
        this.usuarioService.salvarUsuarioLogado(usuario);
        this.router.navigateByUrl('/home');
        this.presentToast();
      }else{
this.presentAlert('ADVERTENCIA', 'USUÁRIO OU SENHA INVÁLIDOS!')
      }
      

    }else {
this.presentAlert('ERRO', 'Formulario invalido, confira os campos!');
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Login efetuado com sucesso!',
      duration: 2000
    });
    toast.present();
  }

  async presentAlert(titulo: string, mensagem: string) {
    const alert = await this.alertController.create({
     
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentEsqueceu(titulo: string, mensagem: string) { 
    this.presentAlert('ENTRE EM CONTATO:', ' Telefone: (14)3115-2665 <br> OU VÁ ATÉ NOSSA CENTRAL!')
  
  }

}