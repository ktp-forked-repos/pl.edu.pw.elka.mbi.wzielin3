/**
 * Element of the path in cube.
 */
export class PathElement {
  constructor(public prevIdx: number[], public currIdx: number[],
              public symbols: string[], public currVal: number) {
  }
}
