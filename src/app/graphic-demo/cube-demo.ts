import {Graphic} from './graphic';

/**
 * Class responsible for demonstration of the cube
 */
export class Cube {

  private diagonalFactor = 1.36;
  private cubeGraphic;
  private cellSize;
  private cellDiagonalSize;
  private startX;
  private startY;
  private height = 400;
  private width = 800;

  private lengthX;
  private lengthY;
  private lengthZ;

  constructor(private sequences: string[], ctx: CanvasRenderingContext2D) {
    this.calculateParameters();
    this.cubeGraphic = new Graphic(this.height, this.width, this.cellSize, this.diagonalFactor, ctx);
    this.clearCanvas();
    this.addInterruptedEdges();
    this.addEdges();
    this.addSequenceElements();
  }

  /**
   * Clear canvas in which cube is being demonstrated
   */
  public clearCanvas() {
    this.cubeGraphic.clearCanvas();
  }

  /**
   * Calculate parameters involved in the cube demonstration
   */
  private calculateParameters() {
    this.lengthX = this.sequences[0].length + 1;
    this.lengthY = this.sequences[1].length + 1;
    this.lengthZ = this.sequences[2].length + 1;
    const factorOffsetX = Math.cos(Math.PI * 15 / 180) * (this.lengthY + this.lengthZ);
    const cellSizeX = this.width / (this.diagonalFactor * factorOffsetX);
    const factorOffsetY = Math.sin(Math.PI * 15 / 180) * (this.lengthY + this.lengthZ);
    const cellSizeY = this.height / (this.diagonalFactor * factorOffsetY + this.lengthX);
    this.cellSize = cellSizeX > cellSizeY ? cellSizeY : cellSizeX;
    this.cellDiagonalSize = this.diagonalFactor * this.cellSize;
    this.startX = Math.cos(Math.PI * 15 / 180) * this.lengthZ * this.cellDiagonalSize;
    this.startX += (800 - factorOffsetX * this.cellDiagonalSize) / 2;
    this.startY = this.cellDiagonalSize * factorOffsetY;
  }

  /**
   * Add interrupted edges of cube
   */
  private addInterruptedEdges() {
    this.cubeGraphic.addLine(this.startX, this.startY, this.lengthX, 90, true);
    this.cubeGraphic.addLine(this.startX, this.startY, this.lengthY, 345, true);
    this.cubeGraphic.addLine(this.startX, this.startY, this.lengthZ, 195, true);
  }

  /**
   * Add all edges of cube
   */
  public addEdges() {
    for (let i = 0; i < this.lengthX; ++i) {
      const y = this.startY + this.cellSize * (i + 1);
      this.cubeGraphic.addLine(this.startX, y, this.lengthY, 345, false);
      this.cubeGraphic.addLine(this.startX, y, this.lengthZ, 195, false);
    }
    for (let i = 0; i < this.lengthY; ++i) {
      const r = this.cellDiagonalSize * (i + 1);
      const angle = Math.PI * 345 / 180;
      const x = this.startX + r * Math.cos(angle);
      const y = this.startY + r * Math.sin(angle);
      this.cubeGraphic.addLine(x, y, this.lengthX, 90, false);
      this.cubeGraphic.addLine(x, y, this.lengthZ, 195, false);
    }
    for (let i = 0; i < this.lengthZ; ++i) {
      const r = this.cellDiagonalSize * (i + 1);
      const angle = Math.PI * 195 / 180;
      const x = this.startX + r * Math.cos(angle);
      const y = this.startY + r * Math.sin(angle);
      this.cubeGraphic.addLine(x, y, this.lengthX, 90, false);
      this.cubeGraphic.addLine(x, y, this.lengthY, 345, false);
    }
  }

  /**
   * Add symbols of sequences
   */
  public addSequenceElements() {
    this.addElementsBySequence(90, 0);
    this.addElementsBySequence(345, 1);
    this.addElementsBySequence(195, 2);
  }

  /**
   * Add value to indicated cell in cube
   * @param {number} angle Angle of cube edge
   * @param {number} seqNo Sequence number
   */
  private addElementsBySequence(angle: number, seqNo: number) {
    const angleRadian = Math.PI * angle / 180;
    for (let i = 0; i < this.sequences[seqNo].length; ++i) {
      let r;
      if (angle !== 90) {
        r = this.cellDiagonalSize * (i + 1);
      } else {
        r = this.cellSize * (i + 1);
      }
      const x = this.startX + r * Math.cos(angleRadian);
      const y = this.startY + r * Math.sin(angleRadian);
      this.cubeGraphic.addTextSequence(x, y, this.sequences[seqNo][i]);
    }
  }


  /**
   * Add value to indicated cell in cube
   * @param {number} x index of cell in X dimension
   * @param {number} y index of cell in Y dimension
   * @param {number} z index of cell in Z dimension
   * @param {number} value Value of cell to add
   */
  public addCellValue(x: number, y: number, z: number, value: number) {
    /** Add value to cell in the front wall */
    if (z === 0) {
      const angle = Math.PI * 345 / 180;
      const point1_R = this.cellDiagonalSize * y;
      const point2_R = this.cellDiagonalSize * (y + 1);
      const point1_X = this.startX + point1_R * Math.cos(angle);
      const point1_Y = this.startY + this.cellSize * x + point1_R * Math.sin(angle);
      const point2_X = this.startX + point2_R * Math.cos(angle);
      const point2_Y = this.startY + this.cellSize * (x + 1) + point2_R * Math.sin(angle);
      this.cubeGraphic.addTextValue(point1_X + (point2_X - point1_X) / 2, point1_Y + (point2_Y - point1_Y), value);
    }
    /** Add value to cell in the left wall except front */
    if (y === 0 && z !== 0) {
      const angle = Math.PI * 195 / 180;
      const point2_R = this.cellDiagonalSize * (z + 1);
      const point1_R = this.cellDiagonalSize * z;
      const point2_X = this.startX + point2_R * Math.cos(angle);
      const point2_Y = this.startY + this.cellSize * (x + 1) + point2_R * Math.sin(angle);
      const point1_X = this.startX + point1_R * Math.cos(angle);
      const point1_Y = this.startY + this.cellSize * x + point1_R * Math.sin(angle);
      this.cubeGraphic.addTextValue(point1_X + (point2_X - point1_X) / 2, point1_Y + (point2_Y - point1_Y), value);
    }
    /** Add value to cell in the upper wall except front */
    if (x === 0 && y !== 0 && z !== 0) {
      const angleRight = Math.PI * 345 / 180;
      const angleLeft = Math.PI * 195 / 180;
      const pointRight_R = this.cellDiagonalSize * y;
      const pointLeft1_R = this.cellDiagonalSize * z;
      const pointLeft2_R = this.cellDiagonalSize * (z + 1);
      const point1_X = this.startX + pointLeft1_R * Math.cos(angleLeft) + pointRight_R * Math.cos(angleRight);
      const point1_Y = this.startY + pointLeft1_R * Math.sin(angleLeft) + pointRight_R * Math.sin(angleRight);
      const point2_Y = this.startY + pointLeft2_R * Math.sin(angleLeft) + pointRight_R * Math.sin(angleRight);
      this.cubeGraphic.addTextValue(point1_X, point1_Y + (point2_Y - point1_Y) / 3, value);
    }
  }

  /**
   * Backlight indicated wall of cube
   * @param wallNo - wall Number
   */
  public backlightWall(wallNo) {
    const angle = Math.PI * 195 / 180;
    const r = this.cellDiagonalSize * wallNo;
    this.cubeGraphic.backlightWall(this.startX + r * Math.cos(angle), this.startY + r * Math.sin(angle), this.lengthX, this.lengthY, wallNo === 0);
  }
}

