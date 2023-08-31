import Konva from "konva";

export default class KonvaRadio extends Konva.Group {
  constructor(config) {
    super(config);

    this.options = config.options || [];
    this.value = config.value || null;

    this.updateRadioButtons()
  }

  updateRadioButtons() {
    this.radioButtons = this.options.map((option, index) => {
      console.log("wwwwwwwwwwwwwwwwwwwwwwwww")
      const radioButton = new Konva.Group({
        x: 0,
        y: index * 40,
      });

      const radioCircle = new Konva.Circle({
        x: 0,
        y: 0,
        radius: 15,
        fill: '#fff',
        stroke: '#ddd',
        strokeWidth: 2,
      });

      radioButton.add(radioCircle);

      const radioInnerCircle = new Konva.Circle({
        x: 0,
        y: 0,
        radius: 8,
        fill: '#64bd63',
        visible: option.value === this.value,
      });

      radioButton.add(radioInnerCircle);

      const radioText = new Konva.Text({
        x: 30,
        y: -7,
        text: option.label,
        fontSize: 16,
      });

      radioButton.add(radioText);

      radioButton.on('click tap', () => {
        this.setValue(option.value);
      });

      return radioButton;
    });

    this.add(...this.radioButtons);
  }

  setValue(newValue) {
    if (this.value === newValue) return;

    this.value = newValue;

    this.radioButtons.forEach((radioButton) => {
      const radioInnerCircle = radioButton.children[1];

      if (this.options[radioButton.index].value === newValue) {
        radioInnerCircle.show();

      } else {
        radioInnerCircle.hide();

      }
    });

    this.getLayer().batchDraw();
  }

  addOptions(newOptions) {
    this.destroyChildren()
    // this.attrs.options.push(newOptions)
    this.options.push(newOptions)
    this.updateRadioButtons()
    this.draw()
  }

  deleteOptions(deletedOptions) {
    console.log(this.getChildren())
    this.destroyChildren()
    console.log(this.getChildren())
    this.options = this.options.filter((option) => {
      return option.value !== deletedOptions.value;
    })
    this.attrs.options = this.attrs.options.filter((option) => {
      return option.value !== deletedOptions.value;
    })
    console.log(this.options)
    this.updateRadioButtons()
    // this.draw()
  }

  /*
    哦天哪
    看看这是那个小天才的解决方法
    他竟然想到了用这样的方法导出真正的HTML
    快看看
    这不是天才是什么
   */
  exportHTMLString() {

    const radioList = []

    this.attrs.options.forEach((option) => {
      radioList.push(`
        <el-radio style="width: 100%" label=${option.label}>
          ${option.label}
        </el-radio>
      `)
    })

    return `
      <el-radio-group
        v-model="radioData"
        style="
          position: absolute;
          left: ${this.attrs.x}px;
          top: ${this.attrs.y}px;
          display: flex;
          flex-wrap: wrap;
        "
      >
        ${radioList}
      </el-radio-group>
    `
  }

  exportHTMLData() {
    return `
      radioData: 1
    `
  }
}
