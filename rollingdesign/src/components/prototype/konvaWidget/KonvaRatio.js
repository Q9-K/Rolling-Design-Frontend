import Konva from "konva";

export default class KonvaRadio extends Konva.Group {
  constructor(options, stageBox) {
    super(options);

    this.componentWidth = options.componentWidth || 150;
    this.componentHeight = options.componentHeight || 50;
    this.cornerRadius = options.cornerRadius || 10;
    this.labelPadding = options.labelPadding || 5;

    this.stageBox = stageBox

    this.customComponent = new Konva.Rect({
      width: this.componentWidth,
      height: this.componentHeight,
      fill: 'white',
      cornerRadius: this.cornerRadius,
    });
    this.add(this.customComponent);

    this.radioButton = new Konva.Circle({
      x: this.labelPadding + 10,
      y: this.componentHeight / 2,
      radius: 8,
      fill: 'white',
      stroke: 'black',
      strokeWidth: 1,
      strokeScaleEnabled: false,
      draggable: false,
    });
    this.add(this.radioButton);

    this.labelText = new Konva.Text({
      x: this.labelPadding + 30,
      y: this.labelPadding + 13,
      text: options.label || 'Radio Option',
      fontSize: 16,
      fill: 'black',
      width: this.componentWidth - 40,
      align: 'left',
    });
    this.add(this.labelText);

    this.setupEditing();
  }

  setupEditing() {

    this.labelText.on('dblclick', () => {
      const oldText = this.labelText.text();
      this.labelText.hide();
      this.getLayer().draw();

      const input = document.createElement('input');
      input.type = 'text';
      input.value = oldText;
      input.style.position = 'absolute';
      input.style.left = this.getX() + this.labelPadding + this.stageBox.left + "px";
      input.style.top = this.getY() + this.labelPadding + this.stageBox.top + "px";
      document.body.appendChild(input);
      input.focus();

      input.addEventListener('blur', () => {
        const newText = input.value;
        input.remove();

        this.labelText.text(newText);
        this.labelText.show();
        this.getLayer().draw();
      });
    });
  }
}

