import {Component, ViewChild} from '@angular/core';
import {Simulator} from '../model/simulator';
import {SimulationDemoComponent} from '../simulation-demo/simulation-demo.component';
import {SimulationParams} from '../model/simulation-params';
import {SimulationFinishedEvent} from '../model/events';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  simulator: Simulator = null;
  eventLog: string;
  simulationParams: SimulationParams;
  @ViewChild(SimulationDemoComponent) simulatorDemoComponent: SimulationDemoComponent;


  startSimulation(event) {
    this.simulationParams = event;
    this.simulator = new Simulator(this.simulationParams);
    this.eventLog = '';
    this.simulatorDemoComponent.createCube(this.simulationParams);
    this.simulatorDemoComponent.setSimulationFinished(false);
  }

  step() {
    const eventStep = this.simulator.step();
    this.simulatorDemoComponent.putCellValue(eventStep);
    if (this.isLastStep(eventStep)) {
      this.simulatorDemoComponent.setSimulationFinished(true);

    }
    if (eventStep !== null) {
      this.eventLog += eventStep.toString() + '\n';
    }
    return eventStep;
  }

  skipAllSteps() {
    while (!(this.simulator.step() instanceof SimulationFinishedEvent)) {
    }
    this.simulatorDemoComponent.putAllCellsValues();
    this.simulatorDemoComponent.showCubeWallDetails(this.simulationParams.sequences[2].length);
    this.simulatorDemoComponent.setSimulationFinished(true);
  }

  isLastStep(eventStep) {
    return eventStep.pathElement.endIdx[0] === this.simulationParams.sequences[0].length &&
      eventStep.pathElement.endIdx[1] === this.simulationParams.sequences[1].length &&
      eventStep.pathElement.endIdx[2] === this.simulationParams.sequences[2].length;
  }
}
