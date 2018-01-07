import {Component, ViewChild} from '@angular/core';
import {Simulator, SimulatorState} from '../model/simulator';
import {SimulationDemoComponent} from '../simulation-demo/simulation-demo.component';
import {SimulationParams} from '../model/simulation-params';
import {
  AppEvent, CellFilledEvent, PathAppEvent, PathElementReconstructedEvent,
  SimulationFinishedEvent
} from '../model/events';
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
  currentStepExplanation: string;
  results: string[] = [];
  @ViewChild(SimulationDemoComponent) simulatorDemoComponent: SimulationDemoComponent;

  constructor(public snackBarError: MatSnackBar) {
    // intentionally empty
  }

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
      this.simulatorDemoComponent.startDemostration(this.runningSimulationParams);
      this.currentStepExplanation = 'Symulacja została rozpoczęta.\nMożna przejść do kolejnego kroku';
    }
  }

  /**
   * Follow one step of simulation
   */
  step(): AppEvent {
    const eventStep = this.simulator.step();
    if (eventStep instanceof CellFilledEvent) {
      this.simulatorDemoComponent.fillCubeCell(eventStep);
      this.setPathAppEventExplanation(eventStep);
    } else if (eventStep instanceof PathElementReconstructedEvent) {
      this.simulatorDemoComponent.reconstructPath(eventStep);
      this.setPathAppEventExplanation(eventStep);
      if (this.isSimulationFinished()) {
        this.showResultOfFitness();
      }
    }
    return eventStep;
  }

  /**
   * Sets current step explanation from given path event.
   *
   * @param {PathAppEvent} event PathAppEvent to be translated to string explanation.
   */
  setPathAppEventExplanation(event: PathAppEvent) {
    let result = '';
    result += 'Do komórki ' + this.getArrayToString(event.pathElement.endIdx) + ' można dojść z komórek:\n';
    for (const pathElement of event.allAllowedPathElements) {
      result += this.getArrayToString(pathElement.startIdx) + ' z dopasowaniem ' +
        this.getArrayToString(pathElement.symbols) + ' i wartością ' + pathElement.endCellVal + '\n';
    }
    this.currentStepExplanation = result;
  }

  /**
   * Translate array to string.
   */
  getArrayToString(array: any[]): string {
    let result = '(';
    for (const element of array) {
      result += element + ', ';
    }
    return result.substring(0, result.length - 2) + ')';
  }

  /**
   * Skips all steps until simulation is finished.
   */
  skipAllSteps() {
    while (!(this.simulator.step() instanceof SimulationFinishedEvent)) {
    }
    this.simulatorDemoComponent.demoCubeByWall(0);
    this.showResultOfFitness();
  }

  /**
   * Skips all steps while cube cells are being calculated.
   */
  skipCalculatingCells() {
    while (this.simulator.getStatus() === SimulatorState.CalculatingCells) {
      this.simulator.step();
    }
    this.simulatorDemoComponent.demoCubeByWall(this.runningSimulationParams.sequences[2].length);
    this.showResultOfFitness();
  }

  /**
   * Returns true if simulation is running, false otherwise.
   */
  isSimulationRunning(): boolean {
    return this.simulator !== null;
  }

  /**
   * Returns true if simulation is running and finished.
   */
  isSimulationFinished(): boolean {
    return this.isSimulationRunning() && this.simulator.getStatus() === SimulatorState.Finished;
  }

  /**
   * Returns true if simulation is running and all cube cells have been filled, false otherwise.
   */
  isCubeFilled(): boolean {
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
