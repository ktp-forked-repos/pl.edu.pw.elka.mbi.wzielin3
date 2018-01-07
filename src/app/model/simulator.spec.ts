import { async } from '@angular/core/testing';

import {Simulator, SimulatorState} from './simulator';
import {SimulationParams} from './simulation-params';
import {SimulationFinishedEvent} from './events';

describe('Simulator', () => {
  let simulationParams: SimulationParams;

  beforeEach(() => {
    simulationParams = new SimulationParams();
    simulationParams.fitnessMatrix['A'] = makeFitnessMatrixRow(10, -10, -10, -10, -5);
    simulationParams.fitnessMatrix['G'] = makeFitnessMatrixRow(-10, 10, -10, -10, -5);
    simulationParams.fitnessMatrix['C'] = makeFitnessMatrixRow(-10, -10, 10, -10, -5);
    simulationParams.fitnessMatrix['T'] = makeFitnessMatrixRow(-10, -10, -10, 10, -5);
    simulationParams.fitnessMatrix['-'] = makeFitnessMatrixRow(-5, -5, -5, -5, 0);
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
    simulationParams.fitnessMatrix['A']['C'] = -3;
    simulationParams.fitnessMatrix['C']['A'] = -3;
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

  it('should fill cube cells first', () => {
    simulationParams.sequences = ['A', 'A', 'A'];
    const simulator = new Simulator(simulationParams);
    expect(simulator.getStatus()).toBe(SimulatorState.CalculatingCells);
  });

  it('should reconstruct path after calculating cells', () => {
    simulationParams.sequences = ['A', 'A', 'A'];
    const simulator = new Simulator(simulationParams);
    while (simulator.getStatus() === SimulatorState.CalculatingCells) {
      simulator.step();
    }
    expect(simulator.getStatus()).toBe(SimulatorState.ReconstructingPath);
  });

  it('should stop after reconstructing path', () => {
    simulationParams.sequences = ['A', 'A', 'A'];
    const simulator = new Simulator(simulationParams);
    while (simulator.getStatus() === SimulatorState.CalculatingCells) {
      simulator.step();
    }
    while (simulator.getStatus() === SimulatorState.ReconstructingPath) {
      simulator.step();
    }
    expect(simulator.getStatus()).toBe(SimulatorState.Finished);
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
