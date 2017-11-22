import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationEditorComponent } from './simulation-editor.component';

describe('SimulationEditorComponent', () => {
  let component: SimulationEditorComponent;
  let fixture: ComponentFixture<SimulationEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulationEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
