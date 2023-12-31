import Konva from "konva";

export default class KonvaSlider extends Konva.Group {
  constructor(config) {
    super(config);

    this.min = config.min || 0;
    this.max = config.max || 100;
    this.value = config.value || 0
    this.attrs.defineType = 'KonvaSlider'
    this.attrs.flagId = config.flagId

    this.sliderRect = new Konva.Rect({
      x: -50,
      y: -5,
      width: 100,
      height: 10,
      fill: '#ddd',
      cornerRadius: 5,
    });

    this.add(this.sliderRect);

    this.sliderCircle = new Konva.Circle({
      x: -50 + (this.value - this.min) / (this.max - this.min) * 100,
      y: 0,
      radius: 15,
      fill: '#fff',
      stroke: '#ddd',
      strokeWidth: 2,
    });

    this.add(this.sliderCircle);
  }

  /*
    哦天哪
    看看这是那个小天才的解决方法
    他竟然想到了用这样的方法导出真正的HTML
    快看看
    这不是天才是什么
   */
  exportHTMLString() {

    const sliderData = "sliderData" + this._id

    return `
      <el-slider
        v-model="${sliderData}"
        style="
          position: absolute;
          left: ${this.attrs.x}px;
          top: ${this.attrs.y}px;
          width: ${this.attrs.width}px;
          height: ${this.attrs.height}px;
        "
        :min="${this.min}"
        :max="${this.max}"
      ></el-slider>
    `
  }

  exportHTMLDate() {

    const sliderData = "sliderData" + this._id

    return `
      ${sliderData}: 0,
    `
  }
}
