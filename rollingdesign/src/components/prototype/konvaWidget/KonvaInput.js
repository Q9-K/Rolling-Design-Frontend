import Konva from "konva";

export default class KonvaInput extends Konva.Group {
  constructor(config) {
    super(config);

    this.attrs.defineType = 'KonvaInput'
    this.attrs.flagId = config.flagId

    // 添加背景矩形
    const background = new Konva.Rect({
      width: config.width,
      height: config.height + 12,
      fill: 'white',
      stroke: 'black',
      strokeWidth: 1,
      cornerRadius: 5,
      strokeScaleEnabled: false,
    });
    this.add(background);

    // 添加文本输入框
    const textNode = new Konva.Text({
      text: '',
      x: 5,
      y: 5,
      width: config.width - 10,
      height: config.height - 10,
      fontSize: 16,
      fontFamily: 'Arial',
      fill: 'black',
      padding: 5,
      listening: false, // 防止文本捕获事件
    });
    this.add(textNode);

    // 添加提示文本
    const placeholderText = new Konva.Text({
      text: '请输入',
      x: 10,
      y: 10,
      width: config.width - 20,
      height: config.height - 20,
      fontSize: 16,
      fontFamily: 'Arial',
      fill: 'gray',
      padding: 5,
      listening: false, // 防止文本捕获事件
    });
    this.add(placeholderText);

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
      <input placeholder="请输入" style="
        position: absolute;
        left: ${this.attrs.x}px;
        top: ${this.attrs.y}px;
        width: ${this.attrs.width}px;
        height: ${this.attrs.height}px;
      " />
    `
  }
}
