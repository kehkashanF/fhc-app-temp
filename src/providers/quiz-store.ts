import { AuthProvider } from './auth';
import { QuizStore } from './../data/quiz/quiz-store.interface';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { ToastController } from "ionic-angular";
import { Quizzes } from "../data/quizzes.interface";
import _ from "lodash";

@Injectable()
export class QuizStoreProvider {

  private quizCollection: QuizStore[] = [];

  constructor(private storage: Storage,
    private _auth: AuthProvider,
    private toastCtrl: ToastController) { }


  addToQuizCollection(quizStore: QuizStore) {
      this.quizCollection.push(quizStore);
      const userId = this._auth.getActiveUser().uid;
    this.storage.set(userId+'/quizCollection', this.quizCollection)
        .then()
        .catch(
        err => {
          this.quizCollection.splice(this.quizCollection.indexOf(quizStore), 1);
        }
        );
  }

  removefromQuizCollection(quizStore: QuizStore) {
    const position = this.quizCollection.findIndex((quizStoreEl: QuizStore) => {
      return (quizStoreEl.quiz.quizId).toLowerCase() === (quizStore.quiz.quizId).toLowerCase();
    });
    this.quizCollection.splice(position, 1);
    const userId = this._auth.getActiveUser().uid;
    this.storage.set(userId+'/quizCollection', this.quizCollection)
      .then()
      .catch(
      err => {
        this.quizCollection.push(quizStore);
      }
      );
  }


  getSolvedQuizCollection() { //full array
    return _.cloneDeep(this.quizCollection);
  }

  getQuizByChapter(chapterId: string): QuizStore[]{
    let quizByChapter: QuizStore[] = [];
    for(let i = 0; i < this.quizCollection.length; i++){
      if((this.quizCollection[i].chapterId).toLowerCase()===chapterId.toLowerCase()){
        quizByChapter.push(this.quizCollection[i]);
      }
    }
    return quizByChapter;
  }

  getQuizBySubject(subjectId: string): QuizStore[]{
    let quizBySubject: QuizStore[] = [];
    for(let i = 0; i < this.quizCollection.length; i++){
      if((this.quizCollection[i].subjectId).toLowerCase()===subjectId.toLowerCase()){
        quizBySubject.push(this.quizCollection[i]);
      }
    }
    return quizBySubject;
  }

  getSolvedQuizFromStore(quizStore: QuizStore) { //one
    let quizElement: QuizStore = this.quizCollection.find((quizEl: QuizStore) => {
      return quizEl.quiz.quizId == quizStore.quiz.quizId;
    });
    return quizElement.quiz;
  }



  isQuizStoreSolved(quizStore: QuizStore) { //one
    return this.quizCollection.find((quizEl: QuizStore) => {
      return quizEl.quiz.quizId == quizStore.quiz.quizId;
    });
  }


  loadSolvedQuizCollection() {
    const userId = this._auth.getActiveUser().uid;
    this.storage.get(userId+'/quizCollection')
      .then(
      (quizStore: QuizStore[]) => {
        this.quizCollection = quizStore != null ? quizStore : [];
        console.log(this.quizCollection);
      }
      )
      .catch(
      err => {
        let toast = this.toastCtrl.create({
          message: 'Could not load list of solved quizzes. Please try again!',
          duration: 3000,
          position: 'middle'
        });

        toast.onDidDismiss(() => {
          console.log('Dismissed Toast');
        });

        toast.present();
      }
      );
  }


}
