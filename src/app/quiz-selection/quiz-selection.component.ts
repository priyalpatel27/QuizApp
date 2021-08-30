import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-quiz-selection',
  templateUrl: './quiz-selection.component.html',
  styleUrls: ['./quiz-selection.component.css']
})
export class QuizSelectionComponent implements OnInit {

  difficultyOption = [
    { id: "any", name: "Any Difficulty"},
    { id: "easy", name: "Easy"},
    { id: "medium", name: "Medium"},
    { id: "hard", name: "Hard"}
  ];

  selectionType = [
    { id: "any", name: "Any Type"},
    { id:"multiple", name: "Multiple Choice"},
    { id:"boolean", name: "True / False"}
  ];

  numberOfQuestions: number = 10;
  difficulty: string = this.difficultyOption[0].id;
  selectType: string = this.selectionType[0].id;

  constructor(private route: ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
  }

  difficultyChange(event: any) {
    this.difficulty = event.target.value;
  }

  selectionChange(event: any) {
    this.selectType = event.target.value;
  }

  numberOfQuestionsChange(event: any) {
    this.numberOfQuestions = event.target.value;

    if (this.numberOfQuestions > 20) {
      this.numberOfQuestions = 20;
    }
  }

  nextPageClick(event: any) {
    this.router.navigate(['quiz'], {queryParams: {number: this.numberOfQuestions, difficulty: this.difficulty, type: this.selectType}});
  }

}
