import { BehaviorSubject, map, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HayhooksService {
  private readonly http = inject(HttpClient);
  private readonly host = 'http://0.0.0.0:1416';

  private pipelineSelection = new BehaviorSubject<string>(null);
  pipelineSelection$ = this.pipelineSelection.asObservable();

  getPipelines(): Observable<string[]> {
    return this.http
      .get(`${this.host}/status`)
      .pipe(map((res: any) => res.pipelines));
  }

  setPipelineSelection(pipeline: string): void {
    this.pipelineSelection.next(pipeline);
  }

  sendQueryToPipeline(query: string): Observable<any> {
    if (!this.pipelineSelection.value) {
      throw new Error('No pipeline selected');
    }

    const prompt = { input_text: query };

    return this.http
      .post(`${this.host}/${this.pipelineSelection.value}/run`, prompt)
      .pipe(map((res: any) => res.result));
  }
}
