import { Component, effect, input, model } from '@angular/core';

@Component({
  selector: 'app-pipeline-select',
  imports: [],
  templateUrl: './pipeline-select.html',
  styleUrl: './pipeline-select.scss',
})
export class PipelineSelect {
  options = input<string[]>();
  selectedItem = model<string | null>();

  constructor() {
    effect(() => {
      if (this.options()?.length > 0) {
        this.selectedItem.set(this.options()[0]);
      } else {
        this.selectedItem.set(null);
      }
    });
  }

  updateSelectedItem(item: string): void {
    this.selectedItem.set(item);
  }
}
