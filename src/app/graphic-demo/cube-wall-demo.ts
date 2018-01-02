import {Graphic} from './graphic';

export class CubeWall {

  private cubeWallGraphic;
  private cellSize;
  private startX = 280;
  private startY = 10;
  private height = 250;
  private width = 800;

  private lengthX;
  private lengthY;

  constructor(private sequences: string[], ctx: CanvasRenderingContext2D) {
    this.calculateParameters();
    this.cubeWallGraphic = new Graphic(this.height, this.width, this.cellSize, 1, ctx);
    this.clearCanvas();
    this.drawInterruptedEdges();
    this.drawEdges();
    this.addSequenceElements();
  }

  clearCanvas() {
    this.cubeWallGraphic.clearCanvas();
  }

  calculateParameters() {
    this.lengthX = this.sequences[0].length + 1;
    this.lengthY = this.sequences[1].length + 1;
    this.cellSize = 240 / (Math.max(this.lengthX, this.lengthY));
  }

  drawInterruptedEdges() {
    this.cubeWallGraphic.drawLine(this.startX, this.startY, this.lengthX, 90, true);
    this.cubeWallGraphic.drawLine(this.startX, this.startY, this.lengthY, 0, true);
  }

  drawEdges() {
    for (let i = 0; i < this.lengthX; ++i) {
      const y = this.startY + this.cellSize * (i + 1);
      this.cubeWallGraphic.drawLine(this.startX, y, this.lengthY, 0, false);
    }
    for (let i = 0; i < this.lengthY; ++i) {
      const x = this.startX + this.cellSize * (i + 1);
      this.cubeWallGraphic.drawLine(x, this.startY, this.lengthX, 90, false);
    }
  }

  addSequenceElements() {
    this.addElementsBySequence(90, 0);
    this.addElementsBySequence(0, 1);
  }

  addElementsBySequence(angle, sequenceNumber) {
    for (let i = 0; i < this.sequences[sequenceNumber].length; ++i) {
      let x = this.startX;
      let y = this.startY;
      if (angle === 90) {
        y += this.cellSize * (i + 1);
      } else if (angle === 0) {
        x += this.cellSize * (i + 1);
      }
      this.cubeWallGraphic.addTextSequence(x, y, this.sequences[sequenceNumber][i]);
    }
  }

  addCellValue(x, y, value) {
    const pointX = this.startX + this.cellSize * y;
    const pointY = this.startY + this.cellSize * x;
    this.cubeWallGraphic.addTextValue(pointX + this.cellSize / 2, pointY + this.cellSize * 3 / 4, value);
  }
}

