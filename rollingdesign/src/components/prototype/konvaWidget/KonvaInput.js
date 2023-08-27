import Konva from "konva";

export default class KonvaInput extends Konva.Group {
  constructor(config) {
    super(config);

    // 添加背景矩形
    const background = new Konva.Rect({
      width: config.width,
      height: config.height,
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
}
