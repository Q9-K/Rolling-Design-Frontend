import Konva from "konva";

export default class KonvaSwitch extends Konva.Group {
  constructor(config) {
    super(config);

    this.isOn = false;

    this.switchRect = new Konva.Rect({
      x: -50,
      y: -15,
      width: 100,
      height: 30,
      fill: '#ddd',
      cornerRadius: 15,
    });

    this.add(this.switchRect);

    this.switchCircle = new Konva.Circle({
      x: -25,
      y: 0,
      radius: 15,
      fill: '#fff',
    });

    this.add(this.switchCircle);

    this.on('click tap', () => {
      this.toggle();
    });
  }

  toggle() {
    this.isOn = !this.isOn;

    if (this.isOn) {
      this.switchRect.to({
        fill: '#64bd63',
        duration: 0.2,
      });

      this.switchCircle.to({
        x: 25,
        duration: 0.2,
      });

    } else {
      this.switchRect.to({
        fill: '#ddd',
        duration: 0.2,
      });

      this.switchCircle.to({
        x: -25,
        duration: 0.2,
      });

    }
  }

  /*
    哦天哪
    看看这是那个小天才的解决方法
    他竟然想到了用这样的方法导出真正的HTML
    快看看
    这不是天才是什么
   */
  exportHTMLString() {

    const switchData = "switchData" + this._id

    return `
      <el-switch
        v-model="${switchData}"
        style="
          --el-switch-on-color: #13ce66;
          position: absolute;
          left: ${this.attrs.x}px;
          top: ${this.attrs.y}px;
        "
      ></el-switch>
    `
  }

  exportHTMLDate() {

    const switchData = "switchData" + this._id

    return `
      ${switchData}: false,
    `
  }
}
