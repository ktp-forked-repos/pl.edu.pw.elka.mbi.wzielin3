import {Component, ElementRef, ViewChild} from '@angular/core';
import {Cube} from '../graphic-demo/cube-demo';
import {Input} from "@angular/compiler/src/core";
import {Simulator} from "../model/simulator";

@Component({
  selector: 'app-algorithm-demo',
  templateUrl: './simulation-demo.component.html',
  styleUrls: ['./simulation-demo.component.css']
})
export class SimulationDemoComponent {
  cube: Cube = null;
  cubeCtx: CanvasRenderingContext2D = null;
  sequences: string[];
  @Input() simulator: Simulator;
  @ViewChild('cubeDemo') canvasCube: ElementRef;
  @ViewChild('cubeWallDemo') canvasCubeWall: ElementRef;


  constructor() {
  }

  createCube(params) {
    this.sequences = params.sequences;
    this.cubeCtx = this.canvasCube.nativeElement.getContext('2d');
    this.cube = new Cube(params.sequences, this.cubeCtx);
  }

  putCellValue(eventStep) {
    if (eventStep.pathElement.endIdx[0] === 0 && eventStep.pathElement.endIdx[1] === 0) {

    }
    this.cube.addCellValue(eventStep.pathElement.endIdx[0], eventStep.pathElement.endIdx[1],
      eventStep.pathElement.endIdx[2], eventStep.pathElement.endCellVal);
   /* const array = this.canvasCube.nativeElement.toDataURL();
    this.canvasCube.nativeElement.getContext('2d').clearRect(0, 0, 800, 500);
    const image = new Image();

      image.onload = function () {
        ctx.drawImage(image, 0, 0);
        this.this.cubeImgSrc = canvasCubeLocal.nativeElement.toDataURL();
        this.cube.blacklightWall(eventStep.pathElement.endIdx[2]);
      };*/

  }

  putCellsValueByWall(z) {
    this.cube = new Cube(this.sequences, this.cubeCtx);
    for (let i = 0; i < this.sequences[1].length; ++i) {
      for (let j = 0; j < this.sequences[0].length; j++) {
        this.cube.addCellValue(eventStep.pathElement.endIdx[0], eventStep.pathElement.endIdx[1],
          eventStep.pathElement.endIdx[2], eventStep.pathElement.endCellVal);

      }
    }
  }
}
