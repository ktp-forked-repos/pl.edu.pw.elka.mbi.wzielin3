import {SimulationParams} from './simulation-params';
import {SimulationParamsErrorType} from './simulation-params-validation-error';

describe('Simulation params', () => {
  let simulationParams: SimulationParams;

  beforeEach(() => {
    simulationParams = new SimulationParams();
    simulationParams.fitnessMatrix['A'] = makeFitnessMatrixRow(10, -10, -10, -10, -5);
    simulationParams.fitnessMatrix['G'] = makeFitnessMatrixRow(-10, 10, -10, -10, -5);
    simulationParams.fitnessMatrix['C'] = makeFitnessMatrixRow(-10, -10, 10, -10, -5);
    simulationParams.fitnessMatrix['T'] = makeFitnessMatrixRow(-10, -10, -10, 10, -5);
    simulationParams.fitnessMatrix['-'] = makeFitnessMatrixRow(-5, -5, -5, -5, 0);
  });

  it('should calculate symbols fitness', () => {
    expect(simulationParams.getFitness(['A', 'A', 'A'])).toBe(30);
    expect(simulationParams.getFitness(['A', 'A', '-'])).toBe(0);
    expect(simulationParams.getFitness(['A', '-', '-'])).toBe(-10);
    expect(simulationParams.getFitness(['A', 'G', 'G'])).toBe(-10);
    expect(simulationParams.getFitness(['A', 'G', '-'])).toBe(-20);
  });

  it('should clone itself', () => {
    simulationParams = new SimulationParams();
    simulationParams.sequences[0] = 'AAA';
    simulationParams.fitnessMatrix['A'] = makeFitnessMatrixRow(10, -10, -10, -10, -5);
    const clone = simulationParams.clone();
    simulationParams.sequences[0] += 'A';
    simulationParams.fitnessMatrix['A']['A'] = -100;
    expect(clone.sequences[0]).toBe('AAA');
    expect(clone.fitnessMatrix['A']['A']).toBe(10);
    expect(simulationParams.sequences[0]).toBe('AAAA');
    expect(simulationParams.fitnessMatrix['A']['A']).toBe(-100);
  });

  it('should validate correctly for default values', () => {
    simulationParams = new SimulationParams();
    const errors = simulationParams.validate();
    expect(errors.length).toBe(0);
  });

  it('should validate wrongly from empty sequence', () => {
    simulationParams = new SimulationParams();
    simulationParams.sequences[0] = '';
    const errors = simulationParams.validate();
    expect(errors.length).toBe(1);
    expect(errors.indexOf(SimulationParamsErrorType.EmptySequence)).toBeGreaterThanOrEqual(0);
  });

  it('should validate wrongly for wrong sequence symbol', () => {
    simulationParams = new SimulationParams();
    simulationParams.sequences[0] = 'D';
    const errors = simulationParams.validate();
    expect(errors.length).toBe(1);
    expect(errors.indexOf(SimulationParamsErrorType.WrongSequenceSymbol)).toBeGreaterThanOrEqual(0);
  });

  it('should validate wrongly for empty fitness matrix cell', () => {
    simulationParams = new SimulationParams();
    simulationParams.fitnessMatrix['A']['A'] = null;
    const errors = simulationParams.validate();
    expect(errors.length).toBe(1);
    expect(errors.indexOf(SimulationParamsErrorType.EmptyFitnessMatrixCell)).toBeGreaterThanOrEqual(0);
  });

  /**
   * Create fitness matrix row for given values.
   */
  function makeFitnessMatrixRow(a, g, c, t, gap) {
    const row = [];
    row['A'] = a;
    row['G'] = g;
    row['C'] = c;
    row['T'] = t;
    row['-'] = gap;
    return row;
  }
});
