import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelineSelect } from './pipeline-select';

describe('PipelineSelect', () => {
  let component: PipelineSelect;
  let fixture: ComponentFixture<PipelineSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipelineSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PipelineSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
