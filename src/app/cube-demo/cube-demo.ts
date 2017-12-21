export class Cube {

  private width = 800;
  private height = 600;
  private centerX;
  private centerY;
  private sizeOfCell;
  private diagonalSizeOfCell;
  private fontSize;
  private lengthX;
  private legnthY;
  private lengthZ;

  constructor(private sequences: string[], private ctx: CanvasRenderingContext2D) {
    this.clearCanvas();
    this.calculateParameters();
    this.drawInterruptedEgdes();
    this.drawEdges();
    this.addSequenceElements();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  calculateParameters() {
    this.sizeOfCell = 600 / (Math.max(this.sequences[0].length, this.sequences[1].length, this.sequences[2].length) * 3);
    this.diagonalSizeOfCell = 1.36 * this.sizeOfCell;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.fontSize = this.sizeOfCell / 1.5;
  }

  drawInterruptedEgdes() {
    this.drawVerticalLine(this.centerX, this.centerY, this.sequences[0].length + 1, true);
    this.drawRightDiagonalLine(this.centerX, this.centerY, this.sequences[1].length + 1, true);
    this.drawLeftDiagonalLine(this.centerX, this.centerY, this.sequences[2].length + 1, true);
  }

  drawEdges() {
    const lengthX = this.sequences[0].length + 1;
    const lengthY = this.sequences[1].length + 1;
    const lengthZ = this.sequences[2].length + 1;
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

  addElementsBySequence(angle, sequenceNumber) {
    this.ctx.font = 'bold ' + this.fontSize + 'px Arial';
    this.ctx.textAlign = 'center';
    const angleRadian = Math.PI * angle / 180;
    for (let i = 0; i < this.sequences[sequenceNumber].length; ++i) {
      let r;
      if (angle !== 90) {
        r = this.diagonalSizeOfCell * (i + 1);
      } else {
        r = this.sizeOfCell * (i + 1);
      }
      const rectX = this.centerX + r * Math.cos(angleRadian);
      const rectY = this.centerY + r * Math.sin(angleRadian);
      this.ctx.beginPath();
      this.ctx.rect(rectX - this.fontSize / 2, rectY - this.fontSize / 2, this.fontSize, this.fontSize);
      this.ctx.fillStyle = 'white';
      this.ctx.fill();
      this.ctx.strokeStyle = 'white';
      this.ctx.stroke();
      this.ctx.fillStyle = 'black';
      this.ctx.fillText(this.sequences[sequenceNumber][i], rectX, rectY + this.fontSize / 2);
    }
    this.ctx.strokeStyle = 'black';
  }

  addSequenceElements() {
    this.addElementsBySequence(90, 0);
    this.addElementsBySequence(345, 1);
    this.addElementsBySequence(195, 2);
  }

}

