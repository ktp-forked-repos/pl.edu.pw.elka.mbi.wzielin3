import {Component } from '@angular/core';
import {SimulationParams} from '../model/simulation-params';
import {Simulator} from '../model/simulator';
import {SimulationFinishedEvent} from '../model/events';
import {MatSnackBar} from '@angular/material';
import {isNull, isUndefined} from 'util';

/**
 * Component responsible for displaying performance test interface.
 */
@Component({
  selector: 'app-simulation-performance',
  templateUrl: './simulation-performance.component.html',
  styleUrls: ['./simulation-performance.component.css']
})
export class SimulationPerformanceComponent {
  /** Used to display test results in view */
  testResults: string;
  /** Starting sequence length. First test case will run for this length. */
  startSeqLength = 10;
  /** Final sequence length. Last test case will run for this length. */
  endSeqLength = 25;
  /** The value of which each test case's sequence length will be incremented. */
  incrementSeqLengthBy = 5;
  /** How many tests will be run for each test case. */
  testsPerEachSeqLength = 1;

  /**
   * Default constructor.
   * @param {MatSnackBar} snackBarError Used to show validation errors.
   */
  constructor(public snackBarError: MatSnackBar) {
    // intentionally empty
  }

  /**
   * Runs performance test if component parameters are valid.
   */
  public test() {
    if (!this.isPositiveInteger(this.startSeqLength) || !this.isPositiveInteger(this.endSeqLength)
      || !this.isPositiveInteger(this.incrementSeqLengthBy) || !this.isPositiveInteger(this.testsPerEachSeqLength)) {
      this.snackBarError.open('Nie wszystkie parametry zostały poprawnie uzupełnione', '', {duration: 5000});
      return;
    }
    this.testResults = '';
    this.testResults += 'Długość sekwencji; Średni czas wykonania symulacji [ms];\n';
    for (let seqLength = this.startSeqLength; seqLength <= this.endSeqLength; seqLength += this.incrementSeqLengthBy) {
      let sequence = '';
      for (let i = 0; i < seqLength; ++i) {
        sequence += 'A';
      }
      const simulationParams = new SimulationParams();
      simulationParams.sequences = [sequence, sequence, sequence];
      const testsCount = this.testsPerEachSeqLength;
      let testsSummedTime = 0;
      for (let testNo = 0; testNo < testsCount; ++testNo) {
        const t0 = performance.now();
        this.act(simulationParams);
        const t1 = performance.now();
        testsSummedTime += t1 - t0;
      }
      const testAvgTime = testsSummedTime / testsCount;
      this.testResults += seqLength + '; ' + testAvgTime + ';\n';
    }
  }

  /**
   * Performs simulation and returns result.
   * @param simulationParams Params of the simulation.
   * @returns Finished simulation event.
   */
  private act(simulationParams: SimulationParams): SimulationFinishedEvent {
    const simulator = new Simulator(simulationParams);
    while (true) {
      const appEvent = simulator.step();
      if (appEvent instanceof SimulationFinishedEvent) {
        return appEvent;
      }
    }
  }

  /**
   * Check if given value is positive integer.
   * @param {number} val Value to check.
   */
  private isPositiveInteger(val: number) {
    return !isNull(val) && !isUndefined(val) && val >= 0;
  }
}
