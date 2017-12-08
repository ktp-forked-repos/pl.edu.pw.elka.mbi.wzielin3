/**
 * Simulation parameters that can be edited in the view.
 */
export class SimulationParams {
  /** Three sequences */
  sequences: string[] = ['AGTTAT', 'GTCGTT', 'ATTCGTAT'];
  /** Fitnes matrix */
  fitnesMatrix: number[][];

  constructor() {
    this.fitnesMatrix = [];
    this.fitnesMatrix['A'] = this.makeFitnessMatrixRow(10, -1, -3, -4, -5);
    this.fitnesMatrix['G'] = this.makeFitnessMatrixRow(-1, 7, -5, -3, -5);
    this.fitnesMatrix['C'] = this.makeFitnessMatrixRow(-3, -5, 9, 0, -5);
    this.fitnesMatrix['T'] = this.makeFitnessMatrixRow(-4, -3, 0, 8, -5);
    this.fitnesMatrix['-'] = this.makeFitnessMatrixRow(-5, -5, -5, -5, 0);
  }

  /**
   * Clone this simulation params.
   * Used to separate input simulation params in component,
   * from simulation params used in simulator.
   */
  clone(): SimulationParams {
    const clone = new SimulationParams();
    clone.sequences = this.sequences.slice(0);
    for (let i = 0; i < this.fitnesMatrix.length; ++i) {
      clone.fitnesMatrix[i] = this.fitnesMatrix[i].slice(0);
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
  getFitnes(symbols: string[]) {
    return this.fitnesMatrix[symbols[0]][symbols[1]] +
      this.fitnesMatrix[symbols[0]][symbols[2]] +
      this.fitnesMatrix[symbols[1]][symbols[2]];
  }
}
