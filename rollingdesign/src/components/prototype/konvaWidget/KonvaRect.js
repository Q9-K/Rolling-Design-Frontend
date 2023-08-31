import Konva from "konva";

export default class KonvaRect extends Konva.Rect {
  constructor(config) {
    super(config);
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
      <div style="
        position: absolute;
        left: ${this.attrs.x}px;
        top: ${this.attrs.y}px;
        width: ${this.attrs.width}px;
        height: ${this.attrs.height}px;
        background-color: ${this.attrs.fill};
        border-radius: ${this.attrs.cornerRadius}px;
        border: ${this.attrs.strokeWidth}px ${this.attrs.stroke} solid;
      "
      ></div>
    `
  }
}
