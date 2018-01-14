import {Component, ElementRef, ViewChild} from '@angular/core';
import {Cube} from '../graphic-demo/cube-demo';
import {Input} from '@angular/core';
import {Simulator, SimulatorState} from '../model/simulator';
import {CubeWall} from '../graphic-demo/cube-wall-demo';
import {CellFilledEvent, PathElementReconstructedEvent} from '../model/events';
import {SimulationParams} from "../model/simulation-params";
import {isNull, isUndefined} from "util";

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
   * @param {SimulationParams} params Params of the simulation.
   */
  public startDemostration(params: SimulationParams) {
    this.sequences = params.sequences;
    this.cubeCtx = this.canvasCube.nativeElement.getContext('2d');
    this.cubeWallCtx = this.canvasCubeWall.nativeElement.getContext('2d');
    this.cube = new Cube(params.sequences, this.cubeCtx);
    this.cubeWall = new CubeWall(this.sequences, this.cubeWallCtx);
    this.cube.addCellValue(0, 0, 0, 0);
    this.cubeWall.addCellValue(0, 0, 0);
    this.cube.backlightWall(0);
    this.currentWallNo = 0;
  }

  /**
   * Fill cube cell after calculating value
   * @param {CellFilledEvent} eventStep CellFilledEvent - fill cell with value event.
   */
  public fillCubeCell(eventStep: CellFilledEvent) {
    const endIdxs = eventStep.pathElement.endIdx;
    /** Backlight last cell */
    if (endIdxs[0] === this.sequences[0].length && endIdxs[1] === this.sequences[1].length && endIdxs[2] === this.sequences[2].length) {
      this.cubeWall.backlightCell(endIdxs[0], eventStep.pathElement.endIdx[1]);
    }
    /** Change wall */
    if (endIdxs[0] === 0 && endIdxs[1] === 0 && endIdxs[2] !== 0) {
      this.createCubeAndFillWalls(endIdxs[2]);
      this.cube.backlightWall(endIdxs[2]);
      this.cubeWall = new CubeWall(this.sequences, this.cubeWallCtx);
    }
    this.cube.addCellValue(endIdxs[0], endIdxs[1], endIdxs[2], eventStep.pathElement.endCellVal);
    this.cubeWall.addCellValue(endIdxs[0], endIdxs[1], eventStep.pathElement.endCellVal);
  }

  /**
   * Create cube and fill all the cells until indicated wall
   * @param {number} z Value of wall number
   */
  public createCubeAndFillWalls(z: number) {
    this.cube = new Cube(this.sequences, this.cubeCtx);
    for (let i = 0; i < z; ++i) {
      for (let j = 0; j <= this.sequences[1].length; ++j) {
        for (let k = 0; k <= this.sequences[0].length; ++k) {
          this.cube.addCellValue(k, j, i, this.simulator.getCubeValue(k, j, i));
        }
      }
    }
  }

  /**
   * Create cube wall and fill it
   * @param {number} z Value of wall number
   */
  public createCubeWallAndFill(z: number) {
    this.cubeWall = new CubeWall(this.sequences, this.cubeWallCtx);
    for (let j = 0; j <= this.sequences[1].length; ++j) {
      for (let k = 0; k <= this.sequences[0].length; ++k) {
        this.cubeWall.addCellValue(k, j, this.simulator.getCubeValue(k, j, z));
      }
    }
  }

  /**
   * Demonstration cube and cube wall
   * @param {number} wallNo Value of wall number
   */
  public demoCubeByWall(wallNo: number) {
    this.createCubeAndFillWalls(this.sequences[2].length + 1);
    this.cube.backlightWall(wallNo);
    this.createCubeWallAndFill(wallNo);
    if (this.isSimulationFinished()) {
      const reconstructedPath = this.simulator.getReconstructedPath();
      for (let i = 0; i < reconstructedPath.length; ++i) {
        if (reconstructedPath[i].startIdx[2] === wallNo) {
          this.cubeWall.backlightCell(reconstructedPath[i].startIdx[0], reconstructedPath[i].startIdx[1]);
        }
      }
      if (wallNo === this.sequences[2].length) {
        this.cubeWall.backlightCell(this.sequences[0].length, this.sequences[1].length);
      }
    }
  }

  /**
   * Demonstration reconstruction path
   * @param {PathElementReconstructedEvent} eventStep PathElementReconstructedEvent - element of the path has been reconstructed.
   */
  public reconstructPath(eventStep: PathElementReconstructedEvent) {
    this.demoCubeByWall(eventStep.pathElement.startIdx[2]);
    if (!this.isSimulationFinished()) {
      this.cubeWall.backlightCell(eventStep.pathElement.startIdx[0], eventStep.pathElement.startIdx[1]);
    }
  }

  /**
   * Demonstration next wall of cube
   */
  public nextWall() {
    if (this.currentWallNo < this.sequences[2].length) {
      this.demoCubeByWall(++this.currentWallNo);
    }
  }

  /**
   * Demonstration previous wall of cube
   */
  public previousWall() {
    if (this.currentWallNo > 0) {
      this.demoCubeByWall(--this.currentWallNo);
    }
  }

  /**
   * Check if simulation is finished
   * @returns true if simulation is finished.
   */
  isSimulationFinished(): boolean {
    if (this.simulator !== null) {
      return this.simulator.getStatus() === SimulatorState.Finished;
    }
    return false;
  }

}
