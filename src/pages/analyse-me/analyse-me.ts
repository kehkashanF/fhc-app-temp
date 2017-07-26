import { LoadingController, Slides } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth';
import { QuizService } from './../../providers/quiz';
import { Quiz } from './../../data/quiz.interface';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VgAPI } from 'videogular2/core';
import { Storage } from "@ionic/storage";
import { Chart } from 'chart.js';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage()
@Component({
  selector: 'page-analyse-me',
  templateUrl: 'analyse-me.html',
})

export class AnalyseMePage implements OnInit {
  visibleState: string = 'visible';
  index: number = 0;
  marks: number = 0;
  analysisCollection: { quizzes: { id: number, video: string, marks: number, questions: Quiz[] }[], explanation: string };
  analysis1: { id: number, video: string, marks: number, questions: Quiz[] };
  analysis2: { id: number, video: string, marks: number, questions: Quiz[] };
  quizCollection: Quiz[];
  currentQuestion: Quiz;
  question: boolean = true;
  answers: boolean = false;
  trigger: boolean = false;
  url: string = '';
  analysisPage = 'AnalysisPage';
  video: boolean = true;
  analysisVideo;
  currentId = 0;
  loader: any;
  explain: boolean = false;
  @ViewChild('barCanvas') barCanvas;
  @ViewChild('slide1') slide: Slides;
  barChart: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private quizService: QuizService,
    private authProvider: AuthProvider,
    private api: VgAPI,
    private dom: DomSanitizer,
    private _loader: LoadingController,
    private cdRef: ChangeDetectorRef,
    private storage: Storage) {
  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
    if (this.slide) {
      this.slide.lockSwipes(true);
    }
  }

  ngOnInit() {
    //Check if test not given, only then make a db call...so once test is finished,
    //store a token on client side and give option to restart
    this.quizService.loadQuiz().then((snap:
      { quizzes: { id: number, video: string, marks: number, questions: Quiz[] }[], explanation: string }) => {

      this.analysisCollection = snap;
      console.log(this.analysisCollection);
      this.analysis1 = this.analysisCollection.quizzes[0];
      this.analysis2 = this.analysisCollection.quizzes[1];
      this.quizCollection = this.analysis1.questions;
      this.currentQuestion = this.analysis1.questions[0];
      this.analysisVideo = this.getVideoUrl(this.analysis1.video);
      this.currentId = this.analysis1.id;
      console.log(this.analysisVideo);
    });

  }

  changeQuestion(quesInx: number, ansInx: number) {
    this.quizCollection[quesInx].answers[ansInx].selected = true;

    if (quesInx + 1 < this.quizCollection.length) {
      this.slide.lockSwipes(false);
      this.slide.slideNext(500);
      this.slide.lockSwipes(true);
    } else {
      if (this.currentId === this.analysis1.id) {
        this.analysis1.questions = this.quizCollection;
        this.analysis1 = this.analysisFunc(this.analysis1);
        this.currentId = this.analysis2.id;
        this.quizCollection = this.analysis2.questions;
        this.analysisVideo = this.getVideoUrl(this.analysis2.video);
        this.video = true;
      } else if (this.currentId === this.analysis2.id) {
        this.analysis2.questions = this.quizCollection;
        this.question = false;
        this.analysis2 = this.analysisFunc(this.analysis2);
        this.storage.set('solved', true)
          .then()
          .catch(
          err => {
            console.log("Couldn't store!");
          }
          );
        setTimeout(() => {
          this.drawChart();
        }, 700);
      }
    }


  }

  analysisFunc(analysedQuiz: { id: number, video: string, marks: number, questions: Quiz[] }):
    { id: number, video: string, marks: number, questions: Quiz[] } {
    let marks = 0;
    this.answers = true;
    for (var i = 0; i < analysedQuiz.questions.length; i++) {
      for (var j = 0; j < (analysedQuiz.questions[i].answers).length; j++) {
        if (analysedQuiz.questions[i].answers[j].selected && analysedQuiz.questions[i].answers[j].correct) {
          ++marks;
          break;
        }
      }
    }
    analysedQuiz.marks = marks;
    return analysedQuiz;
  }

  startQuiz() {
    if (!this.explain) {
      this.video = false;
    } else {
      this.question = false;
      setTimeout(() => {
        this.drawChart();
      }, 700);
    }

  }

  playVideo() {
    this.api.play();
  }

  onPlayerReady(api: VgAPI) {
    this.api = api;
    this.loader = this._loader.create({
      spinner: 'dots',
      content: "Loading...",
      duration: 3000
    });
    this.loader.present();
    this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(
      this.playVideo.bind(this)
    );


    this.api.getDefaultMedia().subscriptions.ended.subscribe(
      () => {
        this.startQuiz();
      }
    );
  }

  private getVideoUrl(trustVideo) {
    return this.dom.bypassSecurityTrustUrl(trustVideo);
  }

  drawChart() {
    console.log(this.analysis1.marks);
    console.log(this.analysis2.marks);
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'horizontalBar',
      data: {
        labels: ["Test 1", "Test 2"],
        datasets: [{
          data: [this.analysis1.marks, this.analysis2.marks],
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',

          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',

          ],
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true,
              steps: this.quizCollection.length,
              stepSize: 1,
              stepValue: 1,
              max: this.quizCollection.length
            }
          }]
        }
      }

    });
  }

  getExplanation() {
    this.explain = true;
    this.analysisVideo = this.getVideoUrl(this.analysisCollection.explanation);
    this.video = true;
    this.question = true;

    console.log(this.video);
  }
}

