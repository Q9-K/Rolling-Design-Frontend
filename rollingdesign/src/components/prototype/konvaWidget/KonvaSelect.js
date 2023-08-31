import Konva from "konva";

export default class KonvaSelect extends Konva.Group {
  constructor(config, layer) {
    super(config);

    this.options = config.options || [];
    this.value = config.value || null;
    this.layer = layer

    this.updateListTexts(layer)

    this.on('click tap', () => {
      if (this.listGroup.isVisible()) {
        this.listGroup.hide();
        this.arrowGroup.rotation(0);

      } else {
        this.listGroup.show();
        this.arrowGroup.rotation(180);

      }

      layer.draw();
    });
  }

  updateListTexts(layer) {

    this.selectRect = new Konva.Rect({
      x: -50,
      y: -15,
      width: 100,
      height: 30,
      fill: '#fff',
      stroke: '#ddd',
      strokeWidth: 2,
    });

    this.add(this.selectRect);

    const selectedOption = this.options.find(option => option.value === this.value);

    this.selectText = new Konva.Text({
      x: -40,
      y: -7,
      text: selectedOption ? selectedOption.label : '',
      fontSize: 16,
    });

    this.add(this.selectText);

    this.arrowGroup = new Konva.Group({
      x: 30,
      y: 0,
    });

    this.add(this.arrowGroup);

    this.arrowLine1 = new Konva.Line({
      points: [-5, -3, 0, 2, 5, -3],
      stroke: '#ddd',
      strokeWidth: 2,
      lineJoin: 'round',
    });

    this.arrowGroup.add(this.arrowLine1);

    this.listGroup = new Konva.Group({
      x: -50,
      y: 15,
      visible: false,
    });

    this.add(this.listGroup);

    this.listRect = new Konva.Rect({
      width: 100,
      height: this.options.length * 30,
      fill: '#fff',
      stroke: '#ddd',
      strokeWidth: 2,
    });

    this.listGroup.add(this.listRect);

    this.listTexts = this.options.map((option, index) => {
      console.log("can u see us")
      const listText = new Konva.Text({
        x: 10,
        y: index * 30 + 7,
        text: option.label,
        fontSize: 16,
      });

      listText.on('click tap', () => {
        this.setValue(option.value);
        this.listGroup.hide();
        layer.draw();
      });

      return listText;
    });

    this.listGroup.add(...this.listTexts);
  }

  setValue(newValue) {
    if (this.value === newValue) return;

    this.value = newValue;

    const selectedOption = this.options.find(option => option.value === newValue);

    if (selectedOption) {
      this.selectText.text(selectedOption.label);

    } else {
      this.selectText.text('');

    }
  }

  addOptions(newOptions) {
    this.destroyChildren()
    console.log("can u see me")
    // this.attrs.options.push(newOptions)
    this.options.push(newOptions)
    console.log(this.options)
    this.updateListTexts(this.layer)
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
    this.updateListTexts(this.layer)
    // this.draw()
  }

  /*
    哦天哪
    看看这是那个小天才的解决方法
    他竟然想到了用这样的方法导出真正的HTML
    快看看
    这不是天才是什么
   */
  // TODO Select 下拉选择框的HTML
  exportHTMLString() {

    console.log(this.attrs.options)

    console.log(this.options)

    return `
      <el-select
        v-model="selectData"
        style="
          --el-switch-on-color: #13ce66;
          position: absolute;
          left: ${this.attrs.x}px;
          top: ${this.attrs.y}px;
          width: ${this.attrs.width}px;
          height: ${this.attrs.height}px;
        "
      >
        <el-option 
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :label="option.label"
        />
      </el-select>
    `
  }

  exportHTMLDate() {

    function convertJSON(json) {
      let result = [];
      for (let key in json) {
        result.push(json[key]);
      }
      return result;
    }

    const optionsArray = JSON.stringify(this.attrs.options)
    console.log(optionsArray)

    return `
      selectData: false,
      options: ${optionsArray}
    `
  }
}
