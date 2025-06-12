import { marked } from 'marked';

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'markdown',
})
export class MarkdownPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    const rawHtml = marked(value);
    return this.sanitizer.bypassSecurityTrustHtml(rawHtml as string);
  }
}
