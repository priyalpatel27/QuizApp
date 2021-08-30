import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizQuestionsComponent } from './quiz-questions/quiz-questions.component';
import { QuizSelectionComponent } from './quiz-selection/quiz-selection.component';
import { ResultScreenComponent } from './result-screen/result-screen.component';

const routes: Routes = [
  { path: '',   redirectTo: '/quiz-selection', pathMatch: 'full' },
  { path: 'quiz-selection', component: QuizSelectionComponent },
  { path: 'quiz', component: QuizQuestionsComponent },
  { path: 'result', component: ResultScreenComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
