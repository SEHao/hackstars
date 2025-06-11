import { Observable } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { HayhooksService } from '../../services/hayhooks.service';
import { PipelineSelect } from '../pipeline-select/pipeline-select';

@Component({
  selector: 'app-main-nav',
  imports: [CommonModule, PipelineSelect],
  templateUrl: './main-nav.html',
  styleUrl: './main-nav.scss',
})
export class MainNav {
  pipelineOptions$: Observable<string[]> = this.hayhooksService.getPipelines();
  selectedPipeline$: Observable<string> = this.hayhooksService.pipelineSelection$;

  constructor(private hayhooksService: HayhooksService) {}

  selectPipeline(pipeline: string): void {
    this.hayhooksService.setPipelineSelection(pipeline);
  }
}
