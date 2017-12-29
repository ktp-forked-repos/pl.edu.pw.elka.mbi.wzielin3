import {Graphic} from './graphic';

export class Cube {

  private diagonalFactor = 1.36;
  private cubeGraphic;
  private cellSize;
  private cellDiagonalSize;
  private centerX;
  private centerY;
  private height = 500;
  private width = 800;

  private lengthX;
  private lengthY;
  private lengthZ;

  constructor(private sequences: string[], ctx: CanvasRenderingContext2D) {
    this.calculateParameters();
    this.cubeGraphic = new Graphic(500, 800, this.cellSize, this.diagonalFactor, ctx);
    this.cubeGraphic.clearCanvas();

    this.drawInterruptedEdges();
    this.drawEdges();
    this.addSequenceElements();
    this.blacklightWall(0);
    this.addCellValue(0, 0, 0, 0);
  }

  calculateParameters() {
    this.cellSize = this.height / (Math.max(this.sequences[0].length, this.sequences[1].length, this.sequences[2].length) * 2.5);
    this.cellDiagonalSize = this.diagonalFactor * this.cellSize;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.lengthX = this.sequences[0].length + 1;
    this.lengthY = this.sequences[1].length + 1;
    this.lengthZ = this.sequences[2].length + 1;
  }

  drawInterruptedEdges() {
    this.cubeGraphic.drawLine(this.centerX, this.centerY, this.lengthX, 90, true);
    this.cubeGraphic.drawLine(this.centerX, this.centerY, this.lengthY, 345, true);
    this.cubeGraphic.drawLine(this.centerX, this.centerY, this.lengthZ, 195, true);
  }

  drawEdges() {
    for (let i = 0; i < this.lengthX; ++i) {
      const y = this.centerY + this.cellSize * (i + 1);
      this.cubeGraphic.drawLine(this.centerX, y, this.lengthY, 345, false);
      this.cubeGraphic.drawLine(this.centerX, y, this.lengthZ, 195, false);
    }
    for (let i = 0; i < this.lengthY; ++i) {
      const r = this.cellDiagonalSize * (i + 1);
      const angle = Math.PI * 345 / 180;
      const x = this.centerX + r * Math.cos(angle);
      const y = this.centerY + r * Math.sin(angle);
      this.cubeGraphic.drawLine(x, y, this.lengthX, 90, false);
      this.cubeGraphic.drawLine(x, y, this.lengthZ, 195, false);
    }
    for (let i = 0; i < this.lengthZ; ++i) {
      const r = this.cellDiagonalSize * (i + 1);
      const angle = Math.PI * 195 / 180;
      const x = this.centerX + r * Math.cos(angle);
      const y = this.centerY + r * Math.sin(angle);
      this.cubeGraphic.drawLine(x, y, this.lengthX, 90, false);
      this.cubeGraphic.drawLine(x, y, this.lengthY, 345, false);
    }
  }

  addSequenceElements() {
    this.addElementsBySequence(90, 0);
    this.addElementsBySequence(345, 1);
    this.addElementsBySequence(195, 2);
  }

  addElementsBySequence(angle, sequenceNumber) {
    const angleRadian = Math.PI * angle / 180;
    for (let i = 0; i < this.sequences[sequenceNumber].length; ++i) {
      let r;
      if (angle !== 90) {
        r = this.cellDiagonalSize * (i + 1);
      } else {
        r = this.cellSize * (i + 1);
      }
      const x = this.centerX + r * Math.cos(angleRadian);
      const y = this.centerY + r * Math.sin(angleRadian);
      this.cubeGraphic.addTextSequence(x, y, this.sequences[sequenceNumber][i]);
    }
  }

  addCellValue(x, y, z, value) {
    if (z === 0) {
      const angle = Math.PI * 345 / 180;
      const point2_R = this.cellDiagonalSize * (y + 1);
      const point1_R = this.cellDiagonalSize * y;
      const point2_X = this.centerX + point2_R * Math.cos(angle);
      const point2_Y = this.centerY + this.cellSize * (x + 1) + point2_R * Math.sin(angle);
      const point1_X = this.centerX + point1_R * Math.cos(angle);
      const point1_Y = this.centerY + this.cellSize * x + point1_R * Math.sin(angle);
      this.cubeGraphic.addTextValue(point1_X + (point2_X - point1_X) / 2, point1_Y + (point2_Y - point1_Y), value);
    }
    if (y === 0 && z !== 0) {
      const angle = Math.PI * 195 / 180;
      const point2_R = this.cellDiagonalSize * (z + 1);
      const point1_R = this.cellDiagonalSize * z;
      const point2_X = this.centerX + point2_R * Math.cos(angle);
      const point2_Y = this.centerY + this.cellSize * (x + 1) + point2_R * Math.sin(angle);
      const point1_X = this.centerX + point1_R * Math.cos(angle);
      const point1_Y = this.centerY + this.cellSize * x + point1_R * Math.sin(angle);
      this.cubeGraphic.addTextValue(point1_X + (point2_X - point1_X) / 2, point1_Y + (point2_Y - point1_Y), value);
    }
    if (x === 0 && y !== 0 && z !== 0) {
      const angleRight = Math.PI * 345 / 180;
      const angleLeft = Math.PI * 195 / 180;
      const pointRight_R = this.cellDiagonalSize * y;
      const pointLeft1_R = this.cellDiagonalSize * z;
      const pointLeft2_R = this.cellDiagonalSize * (z + 1);
      const point1_X = this.centerX + pointLeft1_R * Math.cos(angleLeft) + pointRight_R * Math.cos(angleRight);
      const point1_Y = this.centerY + pointLeft1_R * Math.sin(angleLeft) + pointRight_R * Math.sin(angleRight);
      const point2_Y = this.centerY + pointLeft2_R * Math.sin(angleLeft) + pointRight_R * Math.sin(angleRight);
      this.cubeGraphic.addTextValue(point1_X, point1_Y + (point2_Y - point1_Y) / 3, value);
    }
  }

  blacklightWall(z) {
    const angle = Math.PI * 195 / 180;
    const r = this.cellDiagonalSize * z;
    this.cubeGraphic.blacklightWall(this.centerX + r * Math.cos(angle), this.centerY + r * Math.sin(angle), this.lengthX, this.lengthY);
  }
}

