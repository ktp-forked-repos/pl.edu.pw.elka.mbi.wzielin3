import {Component, ViewChild} from '@angular/core';
import {Simulator, SimulatorState} from '../model/simulator';
import {SimulationDemoComponent} from '../simulation-demo/simulation-demo.component';
import {SimulationParams} from '../model/simulation-params';
import {CellFilledEvent, PathElementReconstructedEvent, SimulationFinishedEvent} from '../model/events';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  simulator: Simulator = null;
  simulationParams: SimulationParams;
  results: string[] = [];
  @ViewChild(SimulationDemoComponent) simulatorDemoComponent: SimulationDemoComponent;

  startSimulation(event) {
    this.simulationParams = event;
    this.simulator = new Simulator(this.simulationParams);
    this.simulatorDemoComponent.createCube(this.simulationParams);
  }

  step() {
    const eventStep = this.simulator.step();
    if (eventStep instanceof CellFilledEvent) {
      this.simulatorDemoComponent.fillCubeCell(eventStep);
    } else if (eventStep instanceof PathElementReconstructedEvent) {
      this.simulatorDemoComponent.reconstructPath(eventStep);
    } else if (eventStep instanceof SimulationFinishedEvent) {
      this.showResult();
    }
    return eventStep;
  }

  skipAllSteps() {
    while (!(this.simulator.step() instanceof SimulationFinishedEvent)) {
    }
    this.simulatorDemoComponent.putAllCellsValues();
    this.simulatorDemoComponent.showCubeWallDetails(0, true);
    this.showResult();
  }

  isSimulationFinished() {
    if (this.simulator !== null) {
      return this.simulator.getStatus() === SimulatorState.Finished;
    }
    return false;
  }

  showResult() {
    this.results = [];
    const reconstructedPath = this.simulator.getReconstructedPath();
    for (let i = 0; i < reconstructedPath.length; ++i) {
      for (let j = 0; j < this.simulationParams.sequences.length; ++j) {
        if (i === 0) {
          this.results.push('');
        }
        this.results[j] += reconstructedPath[i].symbols[j];
      }
    }
  }
}
