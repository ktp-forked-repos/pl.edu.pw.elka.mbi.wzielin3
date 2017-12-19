import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule, MatTableModule, MatTabsModule, MatToolbarModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { SimulationEditorComponent } from '../simulation-editor/simulation-editor.component';
import { SequenceInputDirective } from '../sequence-input/sequence-input.directive';
import {SimulationDemoComponent} from '../simulation-demo/simulation-demo.component';

@NgModule({
  declarations: [
    AppComponent,
    SimulationEditorComponent,
    SequenceInputDirective,
    SimulationDemoComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, FormsModule,
    MatInputModule, MatButtonModule, MatCardModule, MatTableModule,
    FlexLayoutModule, MatToolbarModule, MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
