import Konva from "konva";

export default class KonvaRect extends Konva.Rect {
  constructor(config) {
    super(config);

    this.attrs.defineType = 'KonvaRect'
    this.attrs.flagId = config.flagId
    if (config.realWidth) {
      this.attrs.realWidth = config.realWidth
    }
    else {
      this.attrs.realWidth = config.width
    }
    if (config.realHeight) {
      this.attrs.realHeight = config.realHeight
    }
    else {
      this.attrs.realHeight = config.height
    }

    this.insertEventListener()
  }

  insertEventListener() {
    this.on('transform', (e) => {

      console.log("-----------------------------")
      console.log(this.height())
      console.log(e)
      console.log("-----------------------------")

      // 更新 width 和 height 属性

      this.attrs.realWidth = this.attrs.scaleX * this.attrs.width
      this.attrs.realHeight = this.attrs.scaleY * this.attrs.height

      console.log(this.attrs.realWidth)
      console.log(this.attrs.realHeight)
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
    console.log(this)

    return `
      <div style="
        position: absolute;
        left: ${this.attrs.x}px;
        top: ${this.attrs.y}px;
        width: ${this.attrs.realWidth}px;
        height: ${this.attrs.realHeight}px;
        background-color: ${this.attrs.fill};
        border-radius: ${this.attrs.cornerRadius}px;
        border: ${this.attrs.strokeWidth}px ${this.attrs.stroke} solid;
      "
      ></div>
    `
  }
}
