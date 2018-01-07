/**
 * Simulation parameters that can be edited in the view.
 */
import {SimulationParamsErrorType} from './simulation-params-validation-error';

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
   * Clone this simulation params.
   * Used to separate input simulation params in component,
   * from simulation params used in simulator.
   */
  public clone(): SimulationParams {
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
   * @return overall fitness of three symbols from three different sequences.
   */
  public getFitness(symbols: string[]): number {
    return this.fitnessMatrix[symbols[0]][symbols[1]] +
      this.fitnessMatrix[symbols[0]][symbols[2]] +
      this.fitnessMatrix[symbols[1]][symbols[2]];
  }

  /**
   * Performs validation of simulation params.
   */
  public validate(): SimulationParamsErrorType[] {
    const errorCollector: SimulationParamsErrorType[] = [];
    this.toUpperCase();
    this.validateFitnessMatrix(errorCollector);
    this.validateEmptySequences(errorCollector);
    this.validateOnlyAllowedSymbolsInSequences(errorCollector);
    return errorCollector;
  }

  /**
   * Change low cases to upper in all sequences
   */
  private toUpperCase() {
    for (let seqNo = 0; seqNo < 3; ++seqNo) {
      this.sequences[seqNo] = this.sequences[seqNo].toUpperCase();
    }
  }

  /**
   * Checks if there is any empty sequence.
   *
   * @param {SimulationParamsErrorType[]} errorCollector array to which errors are added
   */
  private validateEmptySequences(errorCollector: SimulationParamsErrorType[]) {
    for (let seqNo = 0; seqNo < 3; ++seqNo) {
      if (this.sequences[seqNo].length === 0) {
        errorCollector.push(SimulationParamsErrorType.EmptySequence);
        return;
      }
    }
  }

  /**
   * Check if all sequences contains only allowed symbols;
   *
   * @param {SimulationParamsErrorType[]} errorCollector array to which errors are added
   */
  private validateOnlyAllowedSymbolsInSequences(errorCollector: SimulationParamsErrorType[]) {
    const symbols = ['A', 'G', 'C', 'T'];
    for (let seqNo = 0; seqNo < 3; ++seqNo) {
      for (let i = 0; i < this.sequences[seqNo].length; ++i) {
        const symbol = this.sequences[seqNo][i];
        if (symbols.indexOf(symbol) < 0) {
          errorCollector.push(SimulationParamsErrorType.WrongSequenceSymbol);
          return;
        }
      }
    }
  }

  /**
   * Checks if all values in fitness matrix are filled.
   *
   * @param {SimulationParamsErrorType[]} errorCollector array to which errors are added
   */
  private validateFitnessMatrix(errorCollector: SimulationParamsErrorType[]) {
    const symbols = ['A', 'G', 'C', 'T', '-'];
    for (let i = 0; i < symbols.length; ++i) {
      for (let j = 0; j < symbols.length; ++j) {
        if (this.fitnessMatrix[symbols[i]][symbols[j]] === null) {
          errorCollector.push(SimulationParamsErrorType.EmptyFitnessMatrixCell);
          return;
        }
      }
    }
  }
}
