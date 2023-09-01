import Konva from "konva";

export default class KonvaImage extends Konva.Image {
  constructor(config) {
    super(config);

    this.attrs.x = config.x
    this.attrs.y = config.y
    this.attrs.initialWidth = config.width
    this.attrs.initialHeight = config.height

    this.on('transform', () => {
      // 更新 width 和 height 属性
      this.attrs.width = this.attrs.scaleX * this.attrs.initialWidth;
      this.attrs.height = this.attrs.scaleY * this.attrs.initialHeight
    });
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
      <img 
        src="${this.attrs.src}" 
        alt="哈哈"
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
}
