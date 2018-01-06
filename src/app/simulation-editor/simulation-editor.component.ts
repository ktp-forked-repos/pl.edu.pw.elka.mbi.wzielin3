import {Component, Input, Output} from '@angular/core';
import {SimulationParams} from '../model/simulation-params';

@Component({
  selector: 'app-simulation-editor',
  templateUrl: './simulation-editor.component.html',
  styleUrls: ['./simulation-editor.component.css']
})


export class SimulationEditorComponent {
  @Output() @Input() simulationParams: SimulationParams;
  constructor() { }
}
