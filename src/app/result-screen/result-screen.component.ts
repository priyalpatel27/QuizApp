import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-result-screen',
  templateUrl: './result-screen.component.html',
  styleUrls: ['./result-screen.component.css']
})
export class ResultScreenComponent implements OnInit {

  resultReceived = false; // whether we received data to show the statistic
  totalQuestion: number = 0;
  correctAnswers: number = 0;
  resultPercentage: number = 0;

  constructor(private route: ActivatedRoute, private router:Router) { 
    const data = this.router.getCurrentNavigation()?.extras.state;

    this.totalQuestion = data?.totalQuestions;
    this.correctAnswers = data?.correctAnswers;

    this.resultPercentage = (this.correctAnswers/this.totalQuestion) * 100;

    // if user refreshes this screen, the result screen cannot show any statistics because
    // the user has not taken a quiz in that session. so set resultReceived to true only
    // when we have the necessary data
    if (this.totalQuestion !== undefined && this.correctAnswers !== undefined) {
      this.resultReceived = true;
    }
  }

  ngOnInit(): void {
  }

}
