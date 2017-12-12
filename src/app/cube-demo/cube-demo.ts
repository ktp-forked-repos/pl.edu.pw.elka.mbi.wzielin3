export class Cube3d {

  private centerX = 250;
  private centerY = 250;
  private sizeOfCell = 20;
  private diagonalSizeOfCell = 1.36 * this.sizeOfCell;

  constructor(sequences: string[], private ctx: CanvasRenderingContext2D) {
    this.drawInterruptedEgdes(sequences[0].length, sequences[1].length, sequences[2].length);
    this.drawEdges(sequences[0].length, sequences[1].length, sequences[2].length);
    this.addSequenceElements(sequences);
  }

  drawInterruptedEgdes(lengthX, lengthY, lengthZ) {
    this.drawVerticalLine(this.centerX, this.centerY, lengthX, true);
    this.drawRightDiagonalLine(this.centerX, this.centerY, lengthY, true);
    this.drawLeftDiagonalLine(this.centerX, this.centerY, lengthZ, true);
  }

  drawEdges(lengthX, lengthY, lengthZ) {
    for (let i = 0; i < lengthX; ++i) {
      const y = this.centerY + this.sizeOfCell * (i + 1);
      this.drawRightDiagonalLine(this.centerX, y, lengthY, false);
      this.drawLeftDiagonalLine(this.centerX, y, lengthZ, false);
    }
    for (let i = 0; i < lengthY; ++i) {
      const r = this.diagonalSizeOfCell * (i + 1);
      const angle = Math.PI * 345 / 180;
      const x = this.centerX + r * Math.cos(angle);
      const y = this.centerY + r * Math.sin(angle);
      this.drawVerticalLine(x, y, lengthX, false);
      this.drawLeftDiagonalLine(x, y, lengthZ, false);
    }
    for (let i = 0; i < lengthZ; ++i) {
      const r = this.diagonalSizeOfCell * (i + 1);
      const angle = Math.PI * 195 / 180;
      const x = this.centerX + r * Math.cos(angle);
      const y = this.centerY + r * Math.sin(angle);
      this.drawVerticalLine(x, y, lengthX, false);
      this.drawRightDiagonalLine(x, y, lengthY, false);
    }
  }

  drawVerticalLine(x, y, lengthX, isDash) {
    this.ctx.beginPath();
    if (isDash) {
      this.ctx.setLineDash([2, 3]);
    } else {
      this.ctx.setLineDash([]);
    }
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x, y + this.sizeOfCell * lengthX);
    this.ctx.stroke();
  }

  drawRightDiagonalLine(x, y, lengthY, isDash) {
    const r = this.diagonalSizeOfCell * lengthY;
    const angle = Math.PI * 345 / 180;
    this.ctx.beginPath();
    if (isDash) {
      this.ctx.setLineDash([2, 3]);
    } else {
      this.ctx.setLineDash([]);
    }
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + r * Math.cos(angle), y + r * Math.sin(angle));
    this.ctx.stroke();
  }

  drawLeftDiagonalLine(x, y, lengthZ, isDash) {
    const r = this.diagonalSizeOfCell * lengthZ;
    const angle = Math.PI * 195 / 180;
    this.ctx.beginPath();
    if (isDash) {
      this.ctx.setLineDash([2, 3]);
    } else {
      this.ctx.setLineDash([]);
    }
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + r * Math.cos(angle), y + r * Math.sin(angle));
    this.ctx.stroke();
  }

  addSequenceElements(sequences) {

  }

}

