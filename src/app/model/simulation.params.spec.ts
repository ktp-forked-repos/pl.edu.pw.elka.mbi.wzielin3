import { async } from '@angular/core/testing';

import {SimulationParams} from './simulation-params';

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
