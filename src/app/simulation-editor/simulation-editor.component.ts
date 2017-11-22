import { Component, OnInit } from '@angular/core';
import { SimulationParams } from '../simulation-params';

@Component({
  selector: 'app-simulation-editor',
  templateUrl: './simulation-editor.component.html',
  styleUrls: ['./simulation-editor.component.css']
})
export class SimulationEditorComponent implements OnInit {

  simulationParams: SimulationParams = {
    sequence1: '',
    sequence2: '',
    sequence3: ''
  };

  constructor() { }

  ngOnInit() {
  }
}
