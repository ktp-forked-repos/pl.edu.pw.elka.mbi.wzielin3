import {Component, ViewChild} from '@angular/core';
import {Simulator} from '../model/simulator';
import {SimulationDemoComponent} from '../simulation-demo/simulation-demo.component';
import {SimulationParams} from '../model/simulation-params';
import {SimulationFinishedEvent} from '../model/events';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  simulator: Simulator = null;
  eventLog: string;
  simulationParams: SimulationParams;
  @ViewChild(SimulationDemoComponent) simulatorDemoComponent;

  startSimulation(event) {
    this.simulationParams = event;
    this.simulator = new Simulator(this.simulationParams);
    this.eventLog = '';
    this.simulatorDemoComponent.createCube(this.simulationParams);
  }

  step() {
    const eventStep = this.simulator.step();
    if (eventStep !== null) {
      this.eventLog += eventStep.toString() + '\n';
    }
    return eventStep;
  }

  skipAllSteps() {
    while (!(this.step() instanceof SimulationFinishedEvent)) { }
  }
}
