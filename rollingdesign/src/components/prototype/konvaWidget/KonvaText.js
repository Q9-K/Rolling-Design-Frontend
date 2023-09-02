import Konva from "konva";

export default class KonvaText extends Konva.Text {
  constructor(config, stage, layer) {
    super(config);

    this.attrs.defineType = 'KonvaText'

    this.on('dblclick', () => {
      const textPosition = this.getAbsolutePosition();
      const stageBox = stage.container().getBoundingClientRect();

      const areaPosition = {
        x: stageBox.left + textPosition.x,
        y: stageBox.top + textPosition.y
      };

      // create textarea and style it
      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);

      textarea.value = this.text();
      textarea.style.position = 'absolute';
      textarea.style.top = areaPosition.y + 'px';
      textarea.style.left = areaPosition.x + 'px';
      textarea.style.width = this.width();

      textarea.focus();

      textarea.addEventListener('keydown', function (e) {
        // hide on enter
        if (e.keyCode === 13) {
          this.text(textarea.value);
          layer.draw();
          document.body.removeChild(textarea);
        }
      });
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
