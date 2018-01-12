import {Component, Input, Output} from '@angular/core';
import {SimulationParams} from '../model/simulation-params';

/**
 * Component used for simulation parameters input.
 */
@Component({
  selector: 'app-simulation-editor',
  templateUrl: './simulation-editor.component.html',
  styleUrls: ['./simulation-editor.component.css']
})
export class SimulationEditorComponent {
  /** Parameters of simulation that are inputed in this component. */
  @Output() @Input() simulationParams: SimulationParams;
}
