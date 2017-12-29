import {Component, ElementRef, ViewChild} from '@angular/core';
import {Cube} from '../graphic-demo/cube-demo';

@Component({
  selector: 'app-algorithm-demo',
  templateUrl: './simulation-demo.component.html',
  styleUrls: ['./simulation-demo.component.css']
})
export class SimulationDemoComponent {
  cube: Cube = null;
  @ViewChild('cubeDemo') canvasCube: ElementRef;
  @ViewChild('cubeWallDemo') canvasCubeWall: ElementRef;

  constructor() {

  }

  createCube(params) {
    this.cube = new Cube(params.sequences, this.canvasCube.nativeElement.getContext('2d'));
  }

  putCellValue(eventStep) {
    this.cube.addCellValue(eventStep.pathElement.endIdx[0], eventStep.pathElement.endIdx[1],
      eventStep.pathElement.endIdx[2], eventStep.pathElement.endCellVal);
    if (eventStep.pathElement.endIdx[0] === 0 && eventStep.pathElement.endIdx[1] === 0) {
      this.cube.blacklightWall(eventStep.pathElement.endIdx[2]);
    }
  }
}
