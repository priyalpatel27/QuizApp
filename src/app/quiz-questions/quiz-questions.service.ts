import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {QuestionsAPIResponse} from '../models/questions.model';

const endpoint = 'https://opentdb.com/';

@Injectable({
  providedIn: 'root'
})
export class QuizQuestionsService {

  constructor(private http: HttpClient) { }

  // returns the questions observable that can be subscribed to get a list of questions
  getQuestions(numberOfQuestions: number, difficulty: string, selectionType: string) {
    let params: any = {};
    params['amount'] = numberOfQuestions;
    
    if (difficulty !== 'any') {
      params['difficulty'] = difficulty;
    }

    if (selectionType !== 'any') {
      params['type'] = selectionType;
    }

    return this.http.get<QuestionsAPIResponse>(endpoint + 'api.php', {params});
  }
}
