import {Component, Input, Output} from '@angular/core';
import {SimulationParams} from '../model/simulation-params';
import {Simulator} from '../model/simulator';
import {SimulationFinishedEvent} from '../model/events';

@Component({
  selector: 'app-simulation-performance',
  templateUrl: './simulation-performance.component.html',
  styleUrls: ['./simulation-performance.component.css']
})


export class SimulationPerformanceComponent {
  testResults: string;
  startSeqLength = 10;
  endSeqLength = 25;
  incrementSeqLengthBy = 5;
  testsPerEachSeqLength = 1;
  /**
   * Performance test should be run manually.
   */
  public test() {
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
}
