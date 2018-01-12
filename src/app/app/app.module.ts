import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';

import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule, MatTableModule, MatTabsModule, MatToolbarModule, MatSnackBarModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';

import {AppComponent} from './app.component';
import {SimulationEditorComponent} from '../simulation-editor/simulation-editor.component';
import {SequenceInputDirective} from '../sequence-input/sequence-input.directive';
import {SimulationDemoComponent} from '../simulation-demo/simulation-demo.component';
import {SimulationPerformanceComponent} from '../simulation-performance/simulation-performance.component';

/**
 * Main module of this application. Defines dependencies.
 */
@NgModule({
  declarations: [
    AppComponent,
    SequenceInputDirective,
    SimulationEditorComponent,
    SimulationDemoComponent,
    SimulationPerformanceComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, FormsModule,
    MatInputModule, MatButtonModule, MatCardModule, MatTableModule,
    FlexLayoutModule, MatToolbarModule, MatTabsModule, MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
