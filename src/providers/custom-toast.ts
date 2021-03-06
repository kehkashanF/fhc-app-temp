import { Injectable } from '@angular/core';
import { ToastController, ToastOptions } from 'ionic-angular';

@Injectable()
export class CustomToast {

  /* Options for custom toast messages like message, duration, etc */
  toastOptions: ToastOptions;

  constructor(private toast: ToastController) {}

  /* show() which accepts a custom message that will be passed to the toast.create() method
     and shows the toast for 2 secs
  */
  show(message: string){
    this.toastOptions = {
      message: message,
      duration: 5000,
      showCloseButton: true
    }
    this.toast.create(this.toastOptions).present();
  }
}
