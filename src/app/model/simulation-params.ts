/**
 * Simulation parameters that can be edited in the view.
 */
export class SimulationParams {
  /** Three sequences */
  sequences: string[] = ['AGTTAT', 'GTCGTT', 'ATTCGTAT'];
  /** Fitnes matrix */
  fitnessMatrix: number[][];

  constructor() {
    this.fitnessMatrix = [];
    this.fitnessMatrix['A'] = this.makeFitnessMatrixRow(10, -1, -3, -4, -5);
    this.fitnessMatrix['G'] = this.makeFitnessMatrixRow(-1, 7, -5, -3, -5);
    this.fitnessMatrix['C'] = this.makeFitnessMatrixRow(-3, -5, 9, 0, -5);
    this.fitnessMatrix['T'] = this.makeFitnessMatrixRow(-4, -3, 0, 8, -5);
    this.fitnessMatrix['-'] = this.makeFitnessMatrixRow(-5, -5, -5, -5, 0);
  }

  /**
   * Clone this simulation params.
   * Used to separate input simulation params in component,
   * from simulation params used in simulator.
   */
  clone(): SimulationParams {
    const symbols = ['A', 'G', 'C', 'T', '-'];
    const clone = new SimulationParams();
    clone.sequences = this.sequences.slice(0);
    for (let i = 0; i < symbols.length; ++i) {
      for (let j = 0; j < symbols.length; ++j) {
        clone.fitnessMatrix[symbols[i]][symbols[j]] = this.fitnessMatrix[symbols[i]][symbols[j]];
      }
    }
    return clone;
  }

  /**
   * Create fitness matrix row for given values.
   */
  private makeFitnessMatrixRow(a, g, c, t, gap) {
    const row = [];
    row['A'] = a;
    row['G'] = g;
    row['C'] = c;
    row['T'] = t;
    row['-'] = gap;
    return row;
  }

  /**
   * @return overall fitness of three symbols from three different sequences.
   */
  getFitness(symbols: string[]) {
    return this.fitnessMatrix[symbols[0]][symbols[1]] +
      this.fitnessMatrix[symbols[0]][symbols[2]] +
      this.fitnessMatrix[symbols[1]][symbols[2]];
  }

  toUpperCase() {
    for (let seqNo = 0; seqNo < 3; ++seqNo) {
      this.sequences[seqNo] = this.sequences[seqNo].toUpperCase();
    }
  }

  isEmptySequence() {
    for (let seqNo = 0; seqNo < 3; ++seqNo) {
      if (this.sequences[seqNo].length === 0) {
        return true;
      }
    }
    return false;
  }

  isEmptyValueInMatrix() {
    const symbols = ['A', 'G', 'C', 'T', '-'];
    for (let i = 0; i < symbols.length; ++i) {
      for (let j = 0; j < symbols.length; ++j) {
        if (this.fitnessMatrix[symbols[i]][symbols[j]] === null) {
          return true;
        }
      }
    }
    return false;
  }
}
