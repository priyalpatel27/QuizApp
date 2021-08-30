import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { QuizQuestionsService } from './quiz-questions.service';
import {Question, QuestionsAPIResponse} from '../models/questions.model';
import arrayShuffle from 'array-shuffle';

@Component({
  selector: 'app-quiz-questions',
  templateUrl: './quiz-questions.component.html',
  styleUrls: ['./quiz-questions.component.css']
})
export class QuizQuestionsComponent implements OnInit {

  @ViewChildren("choice") choices: QueryList<ElementRef> | undefined;

  numberOfQuestions: number|null = null;
  difficulty: string|null = null;
  selectType: string|null = null;
  questionApiResponse: QuestionsAPIResponse | null = null;
  
  currentQuestionIndex: number = -1;
  correctAnswers: number = 0;
  questionList: { question: Question, answers: string[]}[] = []; // list containing each question and its answer choices
  nextButtonDisabled: boolean = true;
  answerAlreadySelected: boolean = false;
  selectedAnswerIndex: number = -1;

  constructor(private route: ActivatedRoute, private router:Router, private quizQuestionsService: QuizQuestionsService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.numberOfQuestions = params['number'];
      this.difficulty = params['difficulty'];
      this.selectType = params['type'];

      // get the list of questions based on criteria
      if (this.numberOfQuestions !== null && this.difficulty !== null && this.selectType !== null) {
        this.quizQuestionsService.getQuestions(this.numberOfQuestions, this.difficulty, this.selectType).subscribe( response => {
          console.log(response);
          this.questionApiResponse = response;
          this.currentQuestionIndex = 0;

          this.questionList = [];

          // get the list of all answers because the api returns incorrect answers separately from the correct answer
          for (const question of this.questionApiResponse.results) {
            let allChoices = [];
            for (const answer of question.incorrect_answers) {
              allChoices.push(answer);
            }

            allChoices.push(question.correct_answer);

            // shuffle the choices so the correct answer is not always the last
            this.questionList.push( {
              question: question,
              answers: arrayShuffle(allChoices)
            });
          }
        });
      }
     
    });
  }

  // find the index of the correct answer for the current question
  correctAnswerIndex(): number {
    let correctAnswer = this.questionList[this.currentQuestionIndex].question.correct_answer;

    return this.questionList[this.currentQuestionIndex].answers.indexOf(correctAnswer);
  }

  nextClicked() {
    if (this.currentQuestionIndex < this.questionList.length - 1) {
      this.currentQuestionIndex += 1;
      this.answerAlreadySelected = false;
      this.selectedAnswerIndex = -1;

      // reset the styling of choices
      if (this.choices) {
        for (const element of this.choices?.toArray()) {
          element.nativeElement.classList.add('list-group-item-primary');
          element.nativeElement.classList.remove('list-group-item-success');
          element.nativeElement.classList.remove('list-group-item-danger');
        }
      }
    } else if (this.currentQuestionIndex === this.questionList.length - 1) {
      // navigate to the results page when user has answered all questions
      this.router.navigate(['result'], {state: { totalQuestions: this.questionList.length, correctAnswers: this.correctAnswers }});
    }
    this.nextButtonDisabled = true;
  }

  answerClicked(index: number) {
    this.nextButtonDisabled = false;

    if (this.answerAlreadySelected) {
      return;
    }

    this.selectedAnswerIndex = index;

    let selectedAnswer = this.questionList[this.currentQuestionIndex].answers[index];
    let correctAnswer = this.questionList[this.currentQuestionIndex].question.correct_answer;

    if (selectedAnswer !== undefined || selectedAnswer !== null) {
      this.answerAlreadySelected = true;
    }

    let element = this.choices?.toArray()[index].nativeElement;
    
    if (selectedAnswer === correctAnswer) {
      this.correctAnswers += 1;

      // mark the choice green if it is correct choice
      element.classList.remove('list-group-item-primary');
      element.classList.add('list-group-item-success');
    } else {
      // mark the choice red if it is incorrect choice
      element.classList.remove('list-group-item-primary');
      element.classList.add('list-group-item-danger');

      let correctAnswerIndex = this.correctAnswerIndex();

      // also show the correct answer by marking it green
      let correctAnswerElement = this.choices?.toArray()[correctAnswerIndex].nativeElement;
      correctAnswerElement.classList.remove('list-group-item-primary');
      correctAnswerElement.classList.add('list-group-item-success');

    } 
  }

}
