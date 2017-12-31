import {Component, ElementRef, ViewChild} from '@angular/core';
import {Cube} from '../graphic-demo/cube-demo';
import {Input} from '@angular/core';
import {Simulator} from '../model/simulator';
import {CubeWall} from "../graphic-demo/cube-wall-demo";

@Component({
  selector: 'app-algorithm-demo',
  templateUrl: './simulation-demo.component.html',
  styleUrls: ['./simulation-demo.component.css']
})
export class SimulationDemoComponent {
  cube: Cube = null;
  cubeCtx: CanvasRenderingContext2D = null;
  cubeWall: CubeWall = null;
  cubeWallCtx: CanvasRenderingContext2D = null;
  sequences: string[];
  @Input() simulator: Simulator;
  @ViewChild('cubeDemo') canvasCube: ElementRef;
  @ViewChild('cubeWallDemo') canvasCubeWall: ElementRef;

  constructor() {
  }

  createCube(params) {
    this.sequences = params.sequences;
    this.cubeCtx = this.canvasCube.nativeElement.getContext('2d');
    this.cubeWallCtx = this.canvasCubeWall.nativeElement.getContext('2d');
    this.cube = new Cube(params.sequences, this.cubeCtx);
    this.cube.addCellValue(0, 0, 0, 0);
  }

  putCellValue(eventStep) {
    if (eventStep.pathElement.endIdx[0] === 1 && eventStep.pathElement.endIdx[1] === 0 && eventStep.pathElement.endIdx[2] === 0) {
      this.cube.blacklightWall(0);
      this.cubeWall = new CubeWall(this.sequences, this.cubeWallCtx);
      this.cubeWall.addCellValue(0, 0, 0);
    }
    if (eventStep.pathElement.endIdx[0] === 0 && eventStep.pathElement.endIdx[1] === 0 && eventStep.pathElement.endIdx[2] !== 0) {
      this.cube.clearCanvas();
      this.cubeWall.clearCanvas();
      this.cube = new Cube(this.sequences, this.cubeCtx);
      this.putCellsValueByWall(eventStep.pathElement.endIdx[2]);
      this.cube.blacklightWall(eventStep.pathElement.endIdx[2]);
      this.cubeWall = new CubeWall(this.sequences, this.cubeWallCtx);
    }
    this.cube.addCellValue(eventStep.pathElement.endIdx[0], eventStep.pathElement.endIdx[1],
      eventStep.pathElement.endIdx[2], eventStep.pathElement.endCellVal);
    this.cubeWall.addCellValue(eventStep.pathElement.endIdx[0], eventStep.pathElement.endIdx[1], eventStep.pathElement.endCellVal);
  }

  putCellsValueByWall(z) {
    this.cube = new Cube(this.sequences, this.cubeCtx);
    for (let i = 0; i < z; ++i) {
      for (let j = 0; j <= this.sequences[1].length; ++j) {
        for (let k = 0; k <= this.sequences[0].length; ++k) {
          this.cube.addCellValue(k, j, i, this.simulator.getCubeValue(k, j, i));
        }
      }
    }
  }

  putAllCellsValues() {
    this.putCellsValueByWall(this.sequences[2].length + 1);
  }

}
