import {Component, ViewChild} from '@angular/core';
import {Simulator, SimulatorState} from '../model/simulator';
import {SimulationDemoComponent} from '../simulation-demo/simulation-demo.component';
import {SimulationParams} from '../model/simulation-params';
import {CellFilledEvent, PathElementReconstructedEvent, SimulationFinishedEvent} from '../model/events';
import {MatSnackBar} from '@angular/material';
import {ErrorType} from '../model/error-type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  simulator: Simulator = null;
  inputSimulationParams: SimulationParams = new SimulationParams();
  runningSimulationParams: SimulationParams;
  results: string[] = [];
  @ViewChild(SimulationDemoComponent) simulatorDemoComponent: SimulationDemoComponent;

  constructor(public snackBarError: MatSnackBar) {}

  /**
   * Start simulation
   */
  startSimulation() {
    if (this.inputSimulationParams.isEmptySequence()) {
      this.snackBarError.open(ErrorType.Sequence, '', {duration: 5000});
    } else if (this.inputSimulationParams.isEmptyValueInMatrix()) {
      this.snackBarError.open(ErrorType.FitnessMatrix, '', {duration: 5000});
    } else {
      this.runningSimulationParams = this.inputSimulationParams.clone();
      this.runningSimulationParams.toUpperCase();
      this.simulator = new Simulator(this.runningSimulationParams);
      this.simulatorDemoComponent.createCube(this.runningSimulationParams);
    }
  }

  /**
   * Follow one step of simulation
   */
  step() {
    const eventStep = this.simulator.step();
    if (eventStep instanceof CellFilledEvent) {
      this.simulatorDemoComponent.fillCubeCell(eventStep);
    } else if (eventStep instanceof PathElementReconstructedEvent) {
      this.simulatorDemoComponent.reconstructPath(eventStep);
    } else if (eventStep instanceof SimulationFinishedEvent) {
      this.showResultOfFitness();
    }
    return eventStep;
  }

  /**
   * Skips all steps until simulation is finished.
   */
  skipAllSteps() {
    while (!(this.simulator.step() instanceof SimulationFinishedEvent)) { }
    this.simulatorDemoComponent.putAllCellsValues();
    this.simulatorDemoComponent.showCubeWallDetails(0, true);
    this.showResultOfFitness();
  }

  /**
   * Skips all steps while cube cells are being calculated.
   */
  skipCalculatingCells() {
    while (this.simulator.getStatus() === SimulatorState.CalculatingCells) {
      this.simulator.step();
    }
    this.simulatorDemoComponent.putAllCellsValues();
    this.showResultOfFitness();
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
    return this.isSimulationRunning() && this.simulator.getStatus() === SimulatorState.Finished;
  }

  /**
   * Returns true if simulation is running and all cube cells have been filled, false otherwise.
   */
  isCubeFilled() {
    return this.isSimulationRunning() && this.simulator.getStatus() !== SimulatorState.CalculatingCells;
  }

  /**
   * Shows result of fitness algorithm as three sequences with the possibility of break
   */
  showResultOfFitness() {
    this.results = [];
    const reconstructedPath = this.simulator.getReconstructedPath();
    for (let i = 0; i < reconstructedPath.length; ++i) {
      for (let j = 0; j < this.runningSimulationParams.sequences.length; ++j) {
        if (i === 0) {
          this.results.push('');
        }
        this.results[j] += reconstructedPath[i].symbols[j];
      }
    }
  }
}
