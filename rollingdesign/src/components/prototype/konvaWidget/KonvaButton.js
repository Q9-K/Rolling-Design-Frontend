import Konva from "konva";

export default class KonvaButton extends Konva.Group {
  constructor(config, stage, layer) {
    super(config);

    this.attrs.defineType = 'KonvaButton'
    this.attrs.flagId = config.flagId

    let backgroundColor = 'lightgray'
    if (config.fill) {
      backgroundColor = config.fill
    }

    // 添加背景矩形
    const background = new Konva.Rect({
      width: config.width,
      height: config.height,
      fill: backgroundColor,
      stroke: 'white',
      strokeWidth: 0.01,
      cornerRadius: 5,
    });

    this.add(background);

    // 添加文本
    const buttonText = new Konva.Text({
      text: config.text,
      x: 0,
      y: 0,
      width: config.width,
      height: config.height,
      fontSize: 16,
      fontFamily: 'Arial',
      fill: 'black',
      align: 'center',
      verticalAlign: 'middle',
    });

    buttonText.on('dblclick', () => {
      // create textarea over canvas with absolute position

      // first we need to find position for textarea
      // how to find it?

      // at first lets find position of buttonText node relative to the stage:
      const textPosition = buttonText.getAbsolutePosition();

      // then lets find position of stage container on the page:
      const stageBox = stage.container().getBoundingClientRect();

      // so position of textarea will be the sum of positions above:
      const areaPosition = {
        x: stageBox.left + textPosition.x,
        y: stageBox.top + textPosition.y
      };

      // create textarea and style it
      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);

      textarea.value = buttonText.text();
      textarea.style.position = 'absolute';
      textarea.style.top = areaPosition.y + 'px';
      textarea.style.left = areaPosition.x + 'px';
      textarea.style.width = buttonText.width();

      textarea.focus();

      textarea.addEventListener('keydown', function(e) {
        // hide on enter
        if (e.keyCode === 13) {
          buttonText.text(textarea.value);
          layer.draw();
          document.body.removeChild(textarea);
        }
      });
    });

    this.add(buttonText);

    // 监听点击事件
    this.on('click', () => {
      if (config.onClick && typeof config.onClick === 'function') {
        config.onClick();
      }
    });

    // TODO 这里有个bug，就是拖动KonvaButton的时候，背景的灰色不会随之调整大小，明天再说吧

    // 监听鼠标进入和离开事件来改变样式
    this.on('mouseenter', () => {
      document.body.style.cursor = 'pointer';
      background.fill('gray');
      this.getLayer().batchDraw();
    });

    this.on('mouseleave', () => {
      document.body.style.cursor = 'default';
      background.fill('lightgray');
      this.getLayer().batchDraw();
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
      <button style="
        position: absolute;
        left: ${this.attrs.x}px;
        top: ${this.attrs.y}px;
        width: ${this.attrs.width}px;
        height: ${this.attrs.height}px;
        border-radius: ${this.attrs.cornerRadius}px;
        background-color: ${this.attrs.fill};
        order: ${this.attrs.strokeWidth}px ${this.attrs.stroke} solid;
      "
      >${this.attrs.text}</button>
    `
  }
}
