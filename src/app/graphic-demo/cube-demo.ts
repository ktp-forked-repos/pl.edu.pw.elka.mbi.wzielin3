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
    this.cubeGraphic.blacklightWall(this.centerX, this.centerY, this.lengthX, this.lengthY);
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
    const angle = Math.PI * 345 / 180;
    const pointRightR = this.cellDiagonalSize * (y + 1);
    const pointLeftR = this.cellDiagonalSize * y;
    const pointRightX = this.centerX + pointRightR * Math.cos(angle);
    const pointRightY = this.centerY + this.cellSize * (x + 1) + pointRightR * Math.sin(angle);
    const pointLeftX = this.centerX + pointLeftR * Math.cos(angle);
    const pointLeftY = this.centerY + this.cellSize * x + pointLeftR * Math.sin(angle);
    this.cubeGraphic.addTextValue(pointLeftX, pointLeftY, pointRightX - pointLeftX, pointRightY - pointLeftY, value);
  }

}

