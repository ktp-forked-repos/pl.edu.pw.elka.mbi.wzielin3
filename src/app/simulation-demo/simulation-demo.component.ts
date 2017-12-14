import {Component, ElementRef, ViewChild} from '@angular/core';
import {Cube} from '../cube-demo/cube-demo';

@Component({
  selector: 'app-algorithm-demo',
  templateUrl: './simulation-demo.component.html',
  styleUrls: ['./simulation-demo.component.css']
})
export class SimulationDemoComponent {
  cube: Cube = null;
  @ViewChild('simulationDemo') canvasCube: ElementRef;


  constructor() {

  }

  createCube(params) {
    this.cube = new Cube(params.sequences, this.canvasCube.nativeElement.getContext('2d'));
  }

}
