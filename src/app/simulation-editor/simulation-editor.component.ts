import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SimulationParams} from '../model/simulation-params';
import {Simulator, SimulatorState} from "../model/simulator";

@Component({
  selector: 'app-simulation-editor',
  templateUrl: './simulation-editor.component.html',
  styleUrls: ['./simulation-editor.component.css']
})
export class SimulationEditorComponent {

  simulationParams: SimulationParams = new SimulationParams();
  simulationStarted = false;
  @Input() simulator: Simulator;
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

  isSimulationFinished() {
    if (this.simulator !== null) {
      return this.simulator.getStatus() === SimulatorState.Finished;
    }
    return false;
  }
}
