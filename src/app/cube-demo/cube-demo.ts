export class Cube {

  private width = 800;
  private height = 600;
  private centerX;
  private centerY;
  private sizeOfCell;
  private diagonalSizeOfCell;
  private fontSizeSequence;
  private fontSizeValue;
  private lengthX;
  private lengthY;
  private lengthZ;

  constructor(private sequences: string[], private ctx: CanvasRenderingContext2D) {
    this.clearCanvas();
    this.calculateParameters();
    this.drawInterruptedEgdes();
    this.drawEdges();
    this.addSequenceElements();
    this.putCellValue(0, 0, 0, 0);
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  calculateParameters() {
    this.sizeOfCell = 600 / (Math.max(this.sequences[0].length, this.sequences[1].length, this.sequences[2].length) * 3);
    this.diagonalSizeOfCell = 1.36 * this.sizeOfCell;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.fontSizeSequence = this.sizeOfCell / 1.5;
    this.fontSizeValue = this.sizeOfCell / 1.8;
    this.lengthX = this.sequences[0].length + 1;
    this.lengthY = this.sequences[1].length + 1;
    this.lengthZ = this.sequences[2].length + 1;
  }

  drawInterruptedEgdes() {
    this.drawVerticalLine(this.centerX, this.centerY, this.sequences[0].length + 1, true);
    this.drawRightDiagonalLine(this.centerX, this.centerY, this.sequences[1].length + 1, true);
    this.drawLeftDiagonalLine(this.centerX, this.centerY, this.sequences[2].length + 1, true);
  }

  drawEdges() {
    for (let i = 0; i < this.lengthX; ++i) {
      const y = this.centerY + this.sizeOfCell * (i + 1);
      this.drawRightDiagonalLine(this.centerX, y, this.lengthY, false);
      this.drawLeftDiagonalLine(this.centerX, y, this.lengthZ, false);
    }
    for (let i = 0; i < this.lengthY; ++i) {
      const r = this.diagonalSizeOfCell * (i + 1);
      const angle = Math.PI * 345 / 180;
      const x = this.centerX + r * Math.cos(angle);
      const y = this.centerY + r * Math.sin(angle);
      this.drawVerticalLine(x, y, this.lengthX, false);
      this.drawLeftDiagonalLine(x, y, this.lengthZ, false);
    }
    for (let i = 0; i < this.lengthZ; ++i) {
      const r = this.diagonalSizeOfCell * (i + 1);
      const angle = Math.PI * 195 / 180;
      const x = this.centerX + r * Math.cos(angle);
      const y = this.centerY + r * Math.sin(angle);
      this.drawVerticalLine(x, y, this.lengthX, false);
      this.drawRightDiagonalLine(x, y, this.lengthY, false);
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
      this.addTextSequence(rectX - this.fontSizeSequence / 2, rectY - this.fontSizeSequence / 2,
        this.fontSizeSequence, this.fontSizeSequence, this.sequences[sequenceNumber][i]);
    }
  }

  addTextSequence(x, y, lengthX, lengthY, text) {
    this.ctx.textAlign = 'center';
    this.ctx.font = 'bold ' + this.fontSizeSequence + 'px Arial';
    this.ctx.beginPath();
    this.ctx.rect(x, y, lengthX, lengthY);
    this.ctx.fillStyle = 'white';
    this.ctx.fill();
    this.ctx.strokeStyle = 'white';
    this.ctx.stroke();
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(text, x + lengthX / 2, y + lengthY);
    this.ctx.strokeStyle = 'black';
  }

  addTextValue(x, y, lengthX, lengthY, text) {
    this.ctx.textAlign = 'center';
    this.ctx.font = this.fontSizeValue + 'px Arial';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(text, x + lengthX / 2, y + lengthY);
  }


  addSequenceElements() {
    this.addElementsBySequence(90, 0);
    this.addElementsBySequence(345, 1);
    this.addElementsBySequence(195, 2);
  }

  putCellValue(x, y, z, value) {
    const angle = Math.PI * 345 / 180;
    const pointRightR = this.diagonalSizeOfCell * (y + 1);
    const pointLeftR = this.diagonalSizeOfCell * y;
    const pointRightX = this.centerX + pointRightR * Math.cos(angle);
    const pointRightY = this.centerY + this.sizeOfCell * (x + 1) + pointRightR * Math.sin(angle);
    const pointLeftX = this.centerX + pointLeftR * Math.cos(angle);
    const pointLeftY = this.centerY + this.sizeOfCell * x + pointLeftR * Math.sin(angle);
    this.addTextValue(pointLeftX, pointLeftY, pointRightX - pointLeftX, pointRightY - pointLeftY, value);

  }

}

