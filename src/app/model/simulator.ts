import {SimulationParams} from "./simulation-params";

export class Simulator {
  constructor (private params: SimulationParams) {
    // TODO implement me
    // Initialize empty 3 dimensional cube (initialize only boundary cells)
    // Initialize indexes of next field to calculate (will be calculate in step method)
  }

  /**
   * Performs one step of the simulation.
   */
  step() {
    // TODO iumplement me
    // Calculate value of current cell (indexes stored as field in this class)
    // Return an Event TODO create Event class hierarchy
    // Events should represent a simulation state change which can be interpreted by the view
    // Example event: Cell(i,j,k) filled with value
  }
}
