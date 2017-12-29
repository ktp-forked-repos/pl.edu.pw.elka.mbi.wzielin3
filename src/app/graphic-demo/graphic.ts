export class Graphic {

  private cellDiagonalSize;
  private seqFontSize;
  private valFontSize;

  constructor(private height, private width, private cellSize, private diagonalFactor, private ctx: CanvasRenderingContext2D) {
    this.calculateParameters();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  calculateParameters() {
    this.seqFontSize = this.cellSize / 1.5;
    this.valFontSize = this.cellSize / 2;
    this.cellDiagonalSize = this.diagonalFactor * this.cellSize;
  }

  drawLine(x, y, length, angle, isDash) {
    const angleRadian = Math.PI * angle / 180;
    let r = this.cellSize * length;
    if (angle !== 90) {
      r = r * this.diagonalFactor;
    }
    this.ctx.beginPath();
    if (isDash) {
      this.ctx.setLineDash([2, 3]);
    } else {
      this.ctx.setLineDash([]);
    }
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + r * Math.cos(angleRadian), y + r * Math.sin(angleRadian));
    this.ctx.stroke();
  }

  addTextSequence(x, y, text) {
    this.ctx.textAlign = 'center';
    this.ctx.font = 'bold ' + this.seqFontSize + 'px Arial';
    this.ctx.beginPath();
    this.ctx.rect(x - this.seqFontSize / 2, y - this.seqFontSize / 2, this.seqFontSize, this.seqFontSize);
    this.ctx.fillStyle = 'white';
    this.ctx.fill();
    this.ctx.strokeStyle = 'white';
    this.ctx.stroke();
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(text, x, y + this.seqFontSize / 2);
    this.ctx.strokeStyle = 'black';
  }

  addTextValue(x, y, text) {
    this.ctx.textAlign = 'center';
    this.ctx.font = this.valFontSize + 'px Arial';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(text, x , y);
  }

  blacklightWall(x, y, lengthX, lengthY) {
    const currX: number[] = [];
    const currY: number[] = [];
    const leftDiagAngle = Math.PI * 195 / 180;
    const rightDiagAngle = Math.PI * 345 / 180;
    currX.push(x);
    currY.push(y + lengthX * this.cellSize);
    currX.push(currX[0] + this.cellDiagonalSize * Math.cos(leftDiagAngle));
    currY.push(currY[0] + this.cellDiagonalSize * Math.sin(leftDiagAngle));
    currX.push(x + this.cellDiagonalSize * Math.cos(leftDiagAngle));
    currY.push(y + this.cellDiagonalSize * Math.sin(leftDiagAngle));
    currX.push(currX[2] + lengthY * this.cellDiagonalSize * Math.cos(rightDiagAngle));
    currY.push(currY[2] + lengthY * this.cellDiagonalSize * Math.sin(rightDiagAngle));
    currX.push(currX[3] - this.cellDiagonalSize * Math.cos(leftDiagAngle));
    currY.push(currY[3] - this.cellDiagonalSize * Math.sin(leftDiagAngle));
    if (x === this.width / 2 && y === this.height / 2) {
      x = x + lengthY * this.cellDiagonalSize * Math.cos(rightDiagAngle);
      y = y + lengthX * this.cellSize;
      y = y + lengthY * this.cellDiagonalSize * Math.sin(rightDiagAngle);
    }
    this.ctx.fillStyle = 'rgba(63, 81, 181, 0.5)';
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    for (let i = 0; i < currX.length; ++i) {
      this.ctx.lineTo(currX[i], currY[i]);
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

}
