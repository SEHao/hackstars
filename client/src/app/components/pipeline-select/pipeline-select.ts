import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-pipeline-select',
  imports: [],
  templateUrl: './pipeline-select.html',
  styleUrl: './pipeline-select.scss',
})
export class PipelineSelect {
  options = input<string[]>([]);
  selectedItem = model<string | null>();

  updateSelectedItem(item: string) {
    this.selectedItem.set(item);
  }
}
