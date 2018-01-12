import {Component, Input, Output} from '@angular/core';
import {SimulationParams} from '../model/simulation-params';
import {Simulator} from '../model/simulator';
import {SimulationFinishedEvent} from '../model/events';
import {MatSnackBar} from "@angular/material";
import {isNull, isUndefined} from "util";

@Component({
  selector: 'app-simulation-performance',
  templateUrl: './simulation-performance.component.html',
  styleUrls: ['./simulation-performance.component.css']
})

/**
 * Class responsible for displaying performance test interface.
 */
export class SimulationPerformanceComponent {
  testResults: string;
  startSeqLength = 10;
  endSeqLength = 25;
  incrementSeqLengthBy = 5;
  testsPerEachSeqLength = 1;

  constructor(public snackBarError: MatSnackBar) {
    // intentionally empty
  }

  /**
   * Performance test should be run manually.
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
        const event = this.act(simulationParams);
        const t1 = performance.now();
        const testTime = t1 - t0;
        testsSummedTime += testTime;
      }
      const testAvgTime = testsSummedTime / testsCount;
      this.testResults += seqLength + '; ' + testAvgTime + ';\n';
    }
  }

  /**
   * Performs simulation and returns result.
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
   * @param {number} val value to check
   */
  private isPositiveInteger(val: number) {
    return !isNull(val) && !isUndefined(val) && val >= 0;
  }
}
