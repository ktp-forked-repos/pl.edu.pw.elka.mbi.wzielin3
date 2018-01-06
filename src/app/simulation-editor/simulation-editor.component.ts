import {Component, EventEmitter, Input, NgModule, Output} from '@angular/core';
import {SimulationParams} from '../model/simulation-params';
import {Simulator, SimulatorState} from '../model/simulator';
import {MatSnackBar} from '@angular/material';
import {ErrorType} from '../model/error-type';
@Component({
  selector: 'app-simulation-editor',
  templateUrl: './simulation-editor.component.html',
  styleUrls: ['./simulation-editor.component.css']
})
export class SimulationEditorComponent {
  @Output() @Input() simulationParams: SimulationParams;
  constructor() { }
}
