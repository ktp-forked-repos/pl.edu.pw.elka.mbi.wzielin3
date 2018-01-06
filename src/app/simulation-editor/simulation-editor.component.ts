import {Component, EventEmitter, Input, NgModule, Output} from '@angular/core';
import {SimulationParams} from '../model/simulation-params';
import {Simulator, SimulatorState} from '../model/simulator';
import {MatSnackBar} from '@angular/material';
import {ErrorType} from './input-error/error-type';


@Component({
  selector: 'app-simulation-editor',
  templateUrl: './simulation-editor.component.html',
  styleUrls: ['./simulation-editor.component.css']
})
export class SimulationEditorComponent {
  simulationParams: SimulationParams = new SimulationParams();
  @Input() simulator: Simulator;
  @Output() onStartedSimulation: EventEmitter<SimulationParams> = new EventEmitter();
  @Output() onStepCliked: EventEmitter<string> = new EventEmitter();
  @Output() onSkipAllStepsClicked: EventEmitter<string> = new EventEmitter();
  @Output() onSkipCalculatingCellsClicked: EventEmitter<string> = new EventEmitter();

  constructor(public snackBarError: MatSnackBar) {
  }

  startSimulation() {
    if (this.simulationParams.isEmptySequence()) {
      this.snackBarError.open(ErrorType.Sequence, '', {duration: 5000});
    } else if (this.simulationParams.isEmptyValueInMatrix()) {
      this.snackBarError.open(ErrorType.FitnessMatrix, '', {duration: 5000});
    } else {
      this.onStartedSimulation.emit(this.simulationParams.clone());
    }
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

  /**
   * Perform all steps until cube is filled.
   */
  skipCalculatingCells() {
    this.onSkipCalculatingCellsClicked.emit();
  }

  /**
   * Returns true if simulation is running, false otherwise.
   */
  isSimulationRunning() {
    return this.simulator !== null;
  }

  /**
   * Returns true if simulation is running and finished.
   */
  isSimulationFinished() {
    return this.isSimulationRunning() && this.simulator.getStatus() === SimulatorState.Finished;;
  }

  /**
   * Returns true if simulation is running and all cube cells have been filled, false otherwise.
   */
  isCubeFilled() {
    return this.isSimulationRunning() && this.simulator.getStatus() !== SimulatorState.CalculatingCells;
  }
}
