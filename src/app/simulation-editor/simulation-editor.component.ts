import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {SimulationParams} from '../model/simulation-params';

@Component({
  selector: 'app-simulation-editor',
  templateUrl: './simulation-editor.component.html',
  styleUrls: ['./simulation-editor.component.css']
})
export class SimulationEditorComponent {

  simulationParams: SimulationParams = new SimulationParams();
  simulationStarted = false;

  @Output() onStartedSimulation: EventEmitter<SimulationParams> = new EventEmitter();
  @Output() onStepCliked: EventEmitter<string> = new EventEmitter();
  @Output() onSkipAllStepsClicked: EventEmitter<string> = new EventEmitter();

  constructor() {
  }

  startSimulation() {
    this.simulationStarted = true;
    this.onStartedSimulation.emit(this.simulationParams.clone());
  }

  /**
   * Perform one simulation step.
   *
   * @return {AppEvent}
   */
  step() {
    this.onStepCliked.emit();
  }

  /**
   * Perform all simulation steps.
   */
  skipAllSteps() {
    this.onSkipAllStepsClicked.emit();
  }
}
