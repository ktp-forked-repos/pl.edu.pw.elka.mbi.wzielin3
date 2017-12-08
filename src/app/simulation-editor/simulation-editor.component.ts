import { Component, OnInit } from '@angular/core';
import { SimulationParams } from '../model/simulation-params';
import {Simulator} from '../model/simulator';

@Component({
  selector: 'app-simulation-editor',
  templateUrl: './simulation-editor.component.html',
  styleUrls: ['./simulation-editor.component.css']
})
export class SimulationEditorComponent implements OnInit {

  simulationParams: SimulationParams = new SimulationParams();
  simulator: Simulator = null;
  eventLog: string;

  constructor() { }

  ngOnInit() {
  }

  startSimulation() {
    this.simulator = new Simulator(this.simulationParams.clone());
    this.eventLog = '';
  }

  /**
   * Perform one simulation step.
   *
   * @return {AppEvent}
   */
  step() {
    const event = this.simulator.step();
    if (event !== null) {
      this.eventLog += event.toString() + '\n';
    }
    return event;
  }

  /**
   * Perform all simulation steps.
   */
  skipAllSteps() {
    while (this.step() !== null) { }
  }
}
