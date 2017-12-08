import {SimulationParams} from './simulation-params';
import {AppEvent, CellFilledEvent, PathElementReconstructedEvent} from './events';
import {PathElement} from './path-element';

enum SimulatorState {
  /** Simulator is filling cube cells */
  FillingCells,
  /** Based on cube cells simulator is calculating best path */
  CalculatingBestPath,
  /** Simulation is finished */
  Finished
}

/**
 * Class responsible for performing the simulation.
 */
export class Simulator {
  // Cube to be filled with fitness values
  private readonly cube: number[][][];
  // Indices of current cell in cube. Cube edges are sequnce length + 1.
  private idx: number[];
  // State of this simulator
  private state: SimulatorState;

  /**
   * Init cube, cube indexes and state.
   */
  constructor (private readonly params: SimulationParams) {
    this.state = SimulatorState.FillingCells;
    this.cube = [];
    for (let i = 0; this.isValidIdx(i, 0); ++i) {
      this.cube[i] = [];
      for (let j = 0; this.isValidIdx(j, 1); ++j) {
        this.cube[i][j] = [];
        for (let k = 0; this.isValidIdx(k, 2); ++k) {
          this.cube[i][j][k] = NaN;
        }
      }
    }
    this.cube[0][0][0] = 0;
    this.idx = [0, 0, 0];
    this.incrementIdx();
  }

  /**
   * Performs one step of the simulation.
   */
  public step(): AppEvent {
    switch (this.state) {
      case SimulatorState.FillingCells: return new CellFilledEvent(this.fillCurrCell());
      case SimulatorState.CalculatingBestPath: return new PathElementReconstructedEvent(this.calculatePath());
      default: return null;
    }
    // Return an Event TODO create Event class hierarchy
    // Events should represent a simulation state change which can be interpreted by the view
    // Example event: Cell(i,j,k) filled with value
  }

  /**
   * Calculate previous cell to reach current cell.
   */
  private calculatePath() {
    const pathElement = this.calculateCurrCellMaxRecursive([false, false, false], 0);
    this.idx = pathElement.prevIdx;
    if (this.isCurrCellFirst()) {
      this.state = SimulatorState.Finished;
    }
    return pathElement;
  }

  /**
   * Fill next cell
   */
  private fillCurrCell(): PathElement {
    const pathElement = this.calculateCurrCellMaxRecursive([false, false, false], 0);
    this.setCurrCell(pathElement.currVal);
    if (this.isCurrCellLast()) {
      this.state = SimulatorState.CalculatingBestPath;
    } else {
      this.incrementIdx();
    }
    return pathElement;
  }

  /**
   * Recursive search for best assignment to current cell.
   *
   * @param {boolean[]} isGap array with is recursively build for each possibility
   * @param {number} seqNo sequence number of recursive build
   * @return {PathElement} found path element or null
   */
  private calculateCurrCellMaxRecursive(isGap: boolean[], seqNo: number): PathElement {
    if (seqNo > 2) {
      return this.calculateCurrCell(isGap);
    }
    isGap[seqNo] = true;
    const withGapMax = this.calculateCurrCellMaxRecursive(isGap, seqNo + 1);
    isGap[seqNo] = false;
    const withoutGapMax = this.calculateCurrCellMaxRecursive(isGap, seqNo + 1);
    if (withGapMax === null) {
      return withoutGapMax;
    }
    if (withoutGapMax === null) {
      return withGapMax;
    }
    return withGapMax.currVal > withoutGapMax.currVal
      ? withGapMax
      : withoutGapMax;
  }

  /**
   * Get value for current cell assuming that gaps are specified in given array.
   *
   * @param {boolean[]} isGap array of sequences gaps. At least one sequence must not have a gap.
   * @return {PathElement} found path element or null
   */
  private calculateCurrCell(isGap: boolean[]): PathElement {
    if (isGap.indexOf(false) < 0) {
      return null;
    }
    const idx = this.idx.slice(0);
    const symbols = ['-', '-', '-'];
    for (let seqNo = 0; seqNo < 3; ++seqNo) {
      if (!isGap[seqNo]) {
        idx[seqNo] = idx[seqNo] - 1;
        symbols[seqNo] = this.params.sequences[seqNo][this.idx[seqNo] - 1];
      }
    }
    if (!this.isValidCell(idx)) {
      return null;
    }
    const val = this.getCell(idx) + this.params.getFitnes(symbols);
    return new PathElement(idx.slice(0), this.idx.slice(0), symbols.slice(0), val);
  }

  /**
   * Returns value in cell specified by indices.
   *
   * @param {number[]} idx indices specifing the cell
   * @return {number} value of cell specified by indecies
   */
  private getCell(idx: number[]): number {
    if (this.isValidCell(idx)) {
      return this.cube[idx[0]][idx[1]][idx[2]];
    }
    return NaN;
  }

  /**
   * Sets value in cell specified by indixes.
   *
   * @param {number} val value to be set in cell specified by indices
   */
  private setCurrCell(val: number) {
    this.cube[this.idx[0]][this.idx[1]][this.idx[2]] = val;
  }

  /**
   * Is current cell the first in cube.
   */
  private isCurrCellFirst(): boolean {
    for (let seqNo = 0; seqNo < 3; ++seqNo) {
      if (this.idx[seqNo] > 0) {
        return false;
      }
    }
    return true;
  }

  /**
   * Is current cell the last in cube.
   */
  private isCurrCellLast(): boolean {
    for (let seqNo = 0; seqNo < 3; ++seqNo) {
      if (this.idx[seqNo] < this.params.sequences[seqNo].length) {
        return false;
      }
    }
    return true;
  }

  /**
   * Increment cube's cell indexes to calculate next.
   */
  private incrementIdx() {
    for (let seqNo = 0; seqNo < 3; ++seqNo) {
      this.idx[seqNo]++;
      if (this.isValidCurrIdx(seqNo)) {
        return;
      }
      if (seqNo === 2) {
        throw { msg: 'Cannot increment further - last cell' };
      }
      this.idx[seqNo] = 0;
    }
  }

  /**
   * Check if cell specified by indices is valid
   *
   * @param {number[]} idx indices of cell
   */
  private isValidCell(idx: number[]): boolean {
    for (let seqNo = 0; seqNo < 3; ++seqNo) {
      if (!this.isValidIdx(idx[seqNo], seqNo)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Check if current index is valid cube index for sequence.
   *
   * @param {number} seqNo
   * @return {boolean}
   */
  private isValidCurrIdx(seqNo: number): boolean {
    return this.isValidIdx(this.idx[seqNo], seqNo);
  }

  /**
   * Check if given index is valid cube index for sequence.
   *
   * @param {number} idx
   * @param {number} seqNo
   * @return {boolean}
   */
  private isValidIdx(idx: number, seqNo: number): boolean {
    return idx >= 0 && idx <= this.params.sequences[seqNo].length;
  }
}
