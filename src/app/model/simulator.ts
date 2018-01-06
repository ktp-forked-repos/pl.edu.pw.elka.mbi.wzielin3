import {SimulationParams} from './simulation-params';
import {AppEvent, CellFilledEvent, PathElementReconstructedEvent, SimulationFinishedEvent} from './events';
import {PathElement} from './path-element';

export enum SimulatorState {
  /** Simulator is filling cube cells */
  CalculatingCells,
  /** Based on cube cells simulator is calculating best path */
  ReconstructingPath,
  /** Simulation is finished */
  Finished
}

/**
 * Class responsible for performing the simulation.
 */
export class Simulator {
  /** Cube to be filled with fitness values */
  private readonly cube: number[][][];
  /** Possible gap positions for 3 sequences - always initialiazed with 7 possible permutations */
  private readonly isGapPermutations: boolean[][];
  /** Indices of current cell in cube. Cube edges are sequnce length + 1. */
  private idx: number[];
  /** Current state of this simulator */
  private state: SimulatorState;
  /** The reconstructed path which is the result of simulation */
  private reconstructedPath: PathElement[];

  /**
   * Init cube, cube indexes and state.
   */
  constructor(private readonly params: SimulationParams) {
    // init state
    this.state = SimulatorState.CalculatingCells;
    // init empty cube
    this.cube = this.getEmptyCube();
    this.cube[0][0][0] = 0;
    this.idx = [0, 0, 0];
    this.incrementIdx();
    // init empty reconstructed path
    this.reconstructedPath = [];
    // calculate gapPermutations
    this.isGapPermutations = [];
    this.calculateGapPermutationsRecursive([false, false, false], 0, this.isGapPermutations);
  }


  /**
   * Returnes empty 3-dimensional cube for this simulation.
   */
  private getEmptyCube(): number[][][] {
    const cube = [];
    for (let i = 0; this.isValidSequenceIdx(i, 0); ++i) {
      cube[i] = [];
      for (let j = 0; this.isValidSequenceIdx(j, 1); ++j) {
        cube[i][j] = [];
        for (let k = 0; this.isValidSequenceIdx(k, 2); ++k) {
          cube[i][j][k] = NaN;
        }
      }
    }
    return cube;
  }

  /**
   * Calculates all possible allowed gap permutations for three sequences.
   * Result could also be stores as a readonly value because it doesn't vary between simulations.
   * It always contains 7 out of 8 possible three boolean permutations, except of [true, true, true],
   * which is not allowed during simulation because it means that gaps should be inserted in all three sequences.
   *
   * @param {boolean[]} isGap array used to generate all possibilites
   * @param {number} seqNo array index to change in this recursion step
   * @param isGapPermutations variable in which result is stored
   */
  private calculateGapPermutationsRecursive(isGap: boolean[], seqNo: number, isGapPermutations: boolean[][]) {
    // this permutation of isGap array is fully calculated
    if (seqNo > 2) {
      // add permutation only if at least one sequence doesn't have gap
      if (isGap.indexOf(false) >= 0) {
        isGapPermutations.push(isGap.slice(0));
      }
      return;
    }
    isGap[seqNo] = true;
    this.calculateGapPermutationsRecursive(isGap, seqNo + 1, isGapPermutations);
    isGap[seqNo] = false;
    this.calculateGapPermutationsRecursive(isGap, seqNo + 1, isGapPermutations);
  }

  /**
   * Performs one step of the simulation.
   */
  public step(): AppEvent {
    switch (this.state) {
      case SimulatorState.CalculatingCells:
        return this.calculateCurrCell();
      case SimulatorState.ReconstructingPath:
        return this.reconstructCurrPathElement();
      case SimulatorState.Finished:
        return new SimulationFinishedEvent(this.reconstructedPath);
      default:
        throw {msg: 'Unknown simulation state ' + this.state};
    }
  }

  /**
   * Calculate next cell and return path element corresponding to performed transition.
   *
   * @return event of filling the cell
   */
  private calculateCurrCell(): CellFilledEvent {
    const allPathElements = this.getAllAllowedPathElements();
    const pathElement = this.getBestPathElement(allPathElements);
    this.cube[this.idx[0]][this.idx[1]][this.idx[2]] = pathElement.endCellVal;
    if (this.isCurrCellLast()) {
      this.state = SimulatorState.ReconstructingPath;
    } else {
      this.incrementIdx();
    }
    return new CellFilledEvent(pathElement, allPathElements);
  }

  /**
   * Calculate best path element to previous cell from current cell
   * and move to previous cell.
   *
   * @return event of reconstructed path element.
   */
  private reconstructCurrPathElement(): PathElementReconstructedEvent {
    const allPathElements = this.getAllAllowedPathElements();
    const pathElement = this.getBestPathElement(allPathElements);
    this.idx = pathElement.startIdx;
    if (this.isCurrCellFirst()) {
      this.state = SimulatorState.Finished;
    }
    this.reconstructedPath.unshift(pathElement);
    return new PathElementReconstructedEvent(pathElement, allPathElements);
  }

  /**
   * Returnes all path elements allowed to reach current cell.
   *
   * @return {PathElement[]} All path elements to reach current cell.
   */
  private getAllAllowedPathElements(): PathElement[] {
    const allPathElements: PathElement[] = [];
    for (let i = 0; i < this.isGapPermutations.length; ++i) {
      const pathElement = this.getPathElement(this.isGapPermutations[i]);
      if (pathElement !== null) {
        allPathElements.push(pathElement);
      }
    }
    return allPathElements;
  }

  /**
   * Returnes best path element to reach current cell.
   *
   * @return {PathElement} best path element to reach current cell.
   */
  private getBestPathElement(allPathElements: PathElement[]): PathElement {
    let bestPathElement: PathElement = null;
    for (const pathElement of allPathElements) {
      if (bestPathElement === null || pathElement.endCellVal > bestPathElement.endCellVal) {
        bestPathElement = pathElement;
      }
    }
    return bestPathElement;
  }

  /**
   * Get value for current cell assuming that gaps are specified in given array.
   *
   * @param {boolean[]} isGap array of sequences gaps.
   * @return {PathElement} found path element or null
   */
  private getPathElement(isGap: boolean[]): PathElement {
    const idx = this.idx.slice(0);
    const symbols = ['-', '-', '-'];
    for (let seqNo = 0; seqNo < 3; ++seqNo) {
      if (!isGap[seqNo]) {
        idx[seqNo] = idx[seqNo] - 1;
        symbols[seqNo] = this.params.sequences[seqNo][idx[seqNo]];
      }
    }
    if (!this.isValidIdx(idx)) {
      return null;
    }
    const val = this.cube[idx[0]][idx[1]][idx[2]] + this.params.getFitness(symbols);
    return new PathElement(idx, this.idx.slice(0), symbols, val);
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
   * Transition to next cell with indices.
   */
  private incrementIdx() {
    for (let seqNo = 0; seqNo < 3; ++seqNo) {
      this.idx[seqNo]++;
      if (this.isValidSequenceIdx(this.idx[seqNo], seqNo)) {
        return;
      }
      if (seqNo === 2) {
        throw {msg: 'Cannot increment further - last cell'};
      }
      this.idx[seqNo] = 0;
    }
  }

  /**
   * Check if cell specified by indices is valid
   *
   * @param {number[]} idx indices of cell
   */
  private isValidIdx(idx: number[]): boolean {
    for (let seqNo = 0; seqNo < 3; ++seqNo) {
      if (!this.isValidSequenceIdx(idx[seqNo], seqNo)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Check if given index is valid cube index for given sequence.
   *
   * @param {number} idx idx of cube in sequence dimension
   * @param {number} seqNo sequnce of the index
   * @return {boolean} true if index is valid, false otherwise
   */
  private isValidSequenceIdx(idx: number, seqNo: number): boolean {
    return idx >= 0 && idx <= this.params.sequences[seqNo].length;
  }

  /**
   *
   * @param idxX - index of X dimension of cube
   * @param idxY - index of Y dimension of cube
   * @param idxZ - index of Z dimension of cube
   * @returns value of indicated cell
   */
  public getCubeValue(idxX, idxY, idxZ) {
    return this.cube[idxX][idxY][idxZ];
  }

  /**
   *
   * @returns reconstructed Path
   */
  public getReconstructedPath() {
    return this.reconstructedPath;
  }

  /**
   *
   * @returns status of simulation
   */
  public getStatus() {
    return this.state;
  }
}
