import Konva from "konva";

export default class KonvaText extends Konva.Text {
  constructor(config, stage, layer) {
    super(config);

    this.attrs.defineType = 'KonvaText'
    this.attrs.flagId = config.flagId
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
      <p style="
        position: absolute;
        left: ${this.attrs.x}px; 
        top: ${this.attrs.y}px; 
        font-size: ${this.attrs.fontSize}px; 
        color: ${this.attrs.fill};"
      >${this.attrs.text}</p>
    `
  }
}
