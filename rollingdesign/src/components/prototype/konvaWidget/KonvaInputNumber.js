import Konva from "konva";

export default class KonvaInputNumber extends Konva.Group {
  constructor(config) {
    super(config);

    this.min = config.min || 0;
    this.max = config.max || 100;
    this.value = config.value || 0;

    this.inputRect = new Konva.Rect({
      x: -40,
      y: -15,
      width: 80,
      height: 30,
      fill: '#fff',
      stroke: '#ddd',
      strokeWidth: 2,
    });

    this.add(this.inputRect);

    this.inputText = new Konva.Text({
      x: -40,
      y: -7,
      width: 80,
      align: 'center',
      text: this.value.toString(),
      fontSize: 16,
    });

    this.add(this.inputText);

    this.decreaseButton = new Konva.Rect({
      x: -60,
      y: -15,
      width: 20,
      height: 30,
      fill: '#fff',
      stroke: '#ddd',
      strokeWidth: 2,
    });

    this.add(this.decreaseButton);

    this.decreaseButtonText = new Konva.Text({
      x: -60,
      y: -7,
      width: 20,
      align: 'center',
      text: '-',
      fontSize: 16,
    });

    this.add(this.decreaseButtonText);

    this.decreaseButtonText.on('click tap', () => {
      console.log("-1")
      this.setValue(this.value - 1);
    });

    this.increaseButton = new Konva.Rect({
      x: 40,
      y: -15,
      width: 20,
      height: 30,
      fill: '#fff',
      stroke: '#ddd',
      strokeWidth: 2,
    });

    this.add(this.increaseButton);

    this.increaseButtonText = new Konva.Text({
      x: 40,
      y: -7,
      width: 20,
      align: 'center',
      text: '+',
      fontSize: 16,
    });

    this.add(this.increaseButtonText);

    this.increaseButtonText.on('click tap', () => {
      console.log("+1")
      this.setValue(this.value + 1);
    });
  }

  setValue(newValue) {
    if (newValue < this.min || newValue > this.max) return;

    this.value = newValue;

    this.inputText.text(newValue.toString());
  }

  /*
    哦天哪
    看看这是那个小天才的解决方法
    他竟然想到了用这样的方法导出真正的HTML
    快看看
    这不是天才是什么
   */
  exportHTMLString() {
    return `
      <el-input-number
        v-model="inputNumberData"
        style="
          position: absolute;
          left: ${this.attrs.x}px;
          top: ${this.attrs.y}px;
          width: ${this.attrs.width}px;
          height: ${this.attrs.height}px;
        "
      />
    `
  }

  exportHTMLDate() {
    return `
      inputNumberData: false,
    `
  }
}
