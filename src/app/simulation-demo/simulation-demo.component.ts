import {Component, ElementRef, ViewChild} from '@angular/core';
import {Cube} from '../graphic-demo/cube-demo';
import {Input} from '@angular/core';
import {Simulator, SimulatorState} from '../model/simulator';
import {CubeWall} from '../graphic-demo/cube-wall-demo';

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
  currentWallNo: number;
  @Input() simulator: Simulator;
  @ViewChild('cubeDemo') canvasCube: ElementRef;
  @ViewChild('cubeWallDemo') canvasCubeWall: ElementRef;

  constructor() {
  }

  /**
   * Start demonstration by creating cube and clear cube wall
   * @param params - simulation parameters
   */
  createCube(params) {
    this.sequences = params.sequences;
    this.cubeCtx = this.canvasCube.nativeElement.getContext('2d');
    this.cubeWallCtx = this.canvasCubeWall.nativeElement.getContext('2d');
    this.cube = new Cube(params.sequences, this.cubeCtx);
    this.cube.addCellValue(0, 0, 0, 0);
    if (this.cubeWall !== null) {
      this.cubeWall.clearCanvas();
    }
    this.currentWallNo = 0;
  }

  fillCubeCell(eventStep) {
    if (eventStep.pathElement.endIdx[0] === 1 && eventStep.pathElement.endIdx[1] === 0 && eventStep.pathElement.endIdx[2] === 0) {
      this.cube.backlightWall(0);
      this.cubeWall = new CubeWall(this.sequences, this.cubeWallCtx);
      this.cubeWall.addCellValue(0, 0, 0);
    }
    if (eventStep.pathElement.endIdx[0] === 0 && eventStep.pathElement.endIdx[1] === 0 && eventStep.pathElement.endIdx[2] !== 0) {
      this.cube.clearCanvas();
      this.cubeWall.clearCanvas();
      this.cube = new Cube(this.sequences, this.cubeCtx);
      this.cubeWall = new CubeWall(this.sequences, this.cubeWallCtx);
      this.putCellsValueByWall(eventStep.pathElement.endIdx[2]);
      this.cube.backlightWall(eventStep.pathElement.endIdx[2]);
      this.currentWallNo = eventStep.pathElement.endIdx[2];
    }
    if (eventStep.pathElement.endIdx[0] === this.sequences[0].length &&
      eventStep.pathElement.endIdx[1] === this.sequences[1].length &&
      eventStep.pathElement.endIdx[2] === this.sequences[2].length) {
      this.cubeWall.backlightCellOnWall(eventStep.pathElement.endIdx[0], eventStep.pathElement.endIdx[1]);
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

  putWallCellsValuesByWall(wallNo) {
    for (let j = 0; j <= this.sequences[1].length; ++j) {
      for (let k = 0; k <= this.sequences[0].length; ++k) {
        this.cubeWall.addCellValue(k, j, this.simulator.getCubeValue(k, j, wallNo));
      }
    }
  }

  putAllCellsValues() {
    this.putCellsValueByWall(this.sequences[2].length + 1);
  }

  showCubeWallDetails(wallNo, isFinished) {
    this.cube.clearCanvas();
    if (this.cubeWall !== null) {
      this.cubeWall.clearCanvas();
    }
    this.cube = new Cube(this.sequences, this.cubeCtx);
    this.cubeWall = new CubeWall(this.sequences, this.cubeWallCtx);
    this.putAllCellsValues();
    this.putWallCellsValuesByWall(wallNo);
    this.cube.backlightWall(wallNo);
    this.currentWallNo = wallNo;
    if (isFinished) {
      const reconstructedPath = this.simulator.getReconstructedPath();
      for (let i = 0; i < reconstructedPath.length; ++i) {
        if (reconstructedPath[i].startIdx[2] === wallNo) {
          this.cubeWall.backlightCellOnWall(reconstructedPath[i].startIdx[0], reconstructedPath[i].startIdx[1]);
        }
      }
      if (wallNo === this.sequences[2].length) {
        this.cubeWall.backlightCellOnWall(this.sequences[0].length, this.sequences[1].length);
      }
    }
  }

  reconstructPath(eventStep) {
    if (this.currentWallNo !== eventStep.pathElement.startIdx[2]) {
      this.showCubeWallDetails(eventStep.pathElement.startIdx[2], false);
    }
    this.cubeWall.backlightCellOnWall(eventStep.pathElement.startIdx[0], eventStep.pathElement.startIdx[1]);
  }

  nextWall() {
    if (this.currentWallNo < this.sequences[2].length) {
      this.showCubeWallDetails(++this.currentWallNo, true);
    }
  }

  previousWall() {
    if (this.currentWallNo > 0) {
      this.showCubeWallDetails(--this.currentWallNo, true);
    }
  }

  isSimulationFinished() {
    if (this.simulator !== null) {
      return this.simulator.getStatus() === SimulatorState.Finished;
    }
    return false;
  }
}
