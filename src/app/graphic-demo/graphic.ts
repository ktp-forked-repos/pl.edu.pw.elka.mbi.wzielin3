/**
 * Class responsible for implementation of basic graphic activity
 */
export class Graphic {

  private cellDiagonalSize;
  private seqFontSize;
  private valFontSize;

  constructor(private height, private width, private cellSize, private diagonalFactor, private ctx: CanvasRenderingContext2D) {
    this.calculateParameters();
  }

  /**
   * Clear canvas in which cube or wall is being demonstrated
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Calculate parameters involved in basic graphic activity
   */
  calculateParameters() {
    this.seqFontSize = this.cellSize / 1.5;
    this.valFontSize = this.cellSize / 1.9;
    this.cellDiagonalSize = this.diagonalFactor * this.cellSize;
  }

  /**
   * Add line with indicated parameters
   * @param x - start position X
   * @param y - start position Y
   * @param length of line
   * @param angle of line
   * @param isDash - parameter which is responsible for making dotted line
   */
  addLine(x, y, length, angle, isDash) {
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

  /**
   * Add text with sequence font size
   * @param x
   * @param y
   * @param text
   */
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

  /**
   * Add text with value of cell font size
   * @param x
   * @param y
   * @param text
   */
  addTextValue(x, y, text) {
    this.ctx.textAlign = 'center';
    this.ctx.font = this.valFontSize + 'px Arial';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(text, x, y);
  }

  /**
   * Backlight indicated wall of cube
   * @param x - start point x
   * @param y - start point y
   * @param lengthX - length of edge X
   * @param lengthY - length of edge Y
   * @param isFront - if wall is on the front side
   */
  backlightWall(x, y, lengthX, lengthY, isFront) {
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
    if (isFront) {
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

  /**
   * Backlight indicated cell on the wall
   * @param x - start point X
   * @param y - start point Y
   */
  backlightCell(x, y) {
    const currX: number[] = [];
    const currY: number[] = [];
    const rightDiagAngle = Math.PI * 345 / 180;
    currX.push(x + this.cellDiagonalSize * Math.cos(rightDiagAngle));
    currY.push(y + this.cellDiagonalSize * Math.sin(rightDiagAngle));
    currX.push(currX[0]);
    currY.push(currY[0] + this.cellSize);
    currX.push(currX[1] - this.cellDiagonalSize * Math.cos(rightDiagAngle));
    currY.push(currY[1] - this.cellDiagonalSize * Math.sin(rightDiagAngle));
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
