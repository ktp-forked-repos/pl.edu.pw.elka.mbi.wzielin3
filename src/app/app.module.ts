import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AppComponent } from './app.component';
import { SimulationEditorComponent } from './simulation-editor/simulation-editor.component';
import { SequenceInputDirective } from './sequence-input/sequence-input.directive';

@NgModule({
  declarations: [
    AppComponent,
    SimulationEditorComponent,
    SequenceInputDirective
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, FormsModule,
    MatInputModule, MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
