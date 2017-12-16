import { async } from '@angular/core/testing';

import { Simulator } from './simulator';
import {SimulationParams} from './simulation-params';
import {SimulationFinishedEvent} from './events';

describe('Simulator', () => {
  let simulationParams: SimulationParams;

  beforeEach(() => {
    simulationParams = new SimulationParams();
    simulationParams.fitnesMatrix['A'] = makeFitnessMatrixRow(10, -10, -10, -10, -5);
    simulationParams.fitnesMatrix['G'] = makeFitnessMatrixRow(-10, 10, -10, -10, -5);
    simulationParams.fitnesMatrix['C'] = makeFitnessMatrixRow(-10, -10, 10, -10, -5);
    simulationParams.fitnesMatrix['T'] = makeFitnessMatrixRow(-10, -10, -10, 10, -5);
    simulationParams.fitnesMatrix['-'] = makeFitnessMatrixRow(-5, -5, -5, -5, 0);
  });

  it('should align equal symbols', () => {
    simulationParams.sequences = ['A', 'A', 'A'];
    const event = act();
    expect(event.getSequence(0)).toBe('A');
    expect(event.getSequence(1)).toBe('A');
    expect(event.getSequence(2)).toBe('A');
  });

  it('should align simmilar symbols', () => {
    simulationParams.sequences = ['A', 'C', 'C'];
    simulationParams.fitnesMatrix['A']['C'] = -3;
    simulationParams.fitnesMatrix['C']['A'] = -3;
    const event = act();
    expect(event.getSequence(0)).toBe('A');
    expect(event.getSequence(1)).toBe('C');
    expect(event.getSequence(2)).toBe('C');
  });

  it('shouldnt align not simmilar symbols', () => {
    simulationParams.sequences = ['A', 'C', 'C'];
    const event = act();
    expect(event.getSequence(0)).toBe('A-');
    expect(event.getSequence(1)).toBe('-C');
    expect(event.getSequence(2)).toBe('-C');
  });

  /**
   * Performs simulation and returns result.
   */
  function act(): SimulationFinishedEvent {
    const simulator = new Simulator(simulationParams);
    while (true) {
      const appEvent = simulator.step();
      if (appEvent instanceof SimulationFinishedEvent) {
        return appEvent;
      }
    }
  }

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
