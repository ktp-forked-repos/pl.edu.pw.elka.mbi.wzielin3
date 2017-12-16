import { async } from '@angular/core/testing';

import {SimulationParams} from './simulation-params';

describe('Simulation params', () => {
  let simulationParams: SimulationParams;

  beforeEach(() => {
    simulationParams = new SimulationParams();
    simulationParams.fitnesMatrix['A'] = makeFitnessMatrixRow(10, -10, -10, -10, -5);
    simulationParams.fitnesMatrix['G'] = makeFitnessMatrixRow(-10, 10, -10, -10, -5);
    simulationParams.fitnesMatrix['C'] = makeFitnessMatrixRow(-10, -10, 10, -10, -5);
    simulationParams.fitnesMatrix['T'] = makeFitnessMatrixRow(-10, -10, -10, 10, -5);
    simulationParams.fitnesMatrix['-'] = makeFitnessMatrixRow(-5, -5, -5, -5, 0);
  });

  it('should calculate symbols fitness', () => {
    expect(simulationParams.getFitnes(['A', 'A', 'A'])).toBe(30);
    expect(simulationParams.getFitnes(['A', 'A', '-'])).toBe(0);
    expect(simulationParams.getFitnes(['A', '-', '-'])).toBe(-10);
    expect(simulationParams.getFitnes(['A', 'G', 'G'])).toBe(-10);
    expect(simulationParams.getFitnes(['A', 'G', '-'])).toBe(-20);
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
