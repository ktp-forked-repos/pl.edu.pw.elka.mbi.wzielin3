/**
 * Element of the path in cube.
 * Represents a transition from one cube cell to next cube cell.
 */
export class PathElement {
  constructor(/** Index of path's starting cell */ public startIdx: number[],
              /** Index of path's ending cell */ public endIdx: number[],
              /** Symbols corresponding to path */ public symbols: string[],
              /** Value of endIdx cell in cube */ public endCellVal: number) {
  }
}
