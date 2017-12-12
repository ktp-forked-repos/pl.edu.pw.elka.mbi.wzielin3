import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { SimulationParams } from '../model/simulation-params';
import {Simulator} from '../model/simulator';
import {Cube3d} from '../cube-demo/cube-demo';

@Component({
  selector: 'app-simulation-editor',
  templateUrl: './simulation-editor.component.html',
  styleUrls: ['./simulation-editor.component.css']
})
export class SimulationEditorComponent implements OnInit {

  simulationParams: SimulationParams = new SimulationParams();
  simulator: Simulator = null;
  eventLog: string;
  cube3d: Cube3d = null;
  @ViewChild('simulationDemo') cube3dCanvas: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  startSimulation() {
    this.simulator = new Simulator(this.simulationParams.clone());
    this.eventLog = '';
    this.cube3d = new Cube3d(this.simulationParams.sequences, this.cube3dCanvas.nativeElement.getContext('2d'));
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
