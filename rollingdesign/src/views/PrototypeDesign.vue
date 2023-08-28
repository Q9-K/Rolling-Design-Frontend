<script setup>
import LeftBar from "../components/prototype/left/LeftBar.vue";
import * as Konva from "konva";
import { inject, onMounted, ref, watch } from "vue";
import { saveAs } from 'file-saver'
import Tools from "../components/prototype/right/Tools.vue";
import KonvaInput from "../components/prototype/konvaWidget/KonvaInput";
import KonvaButton from "../components/prototype/konvaWidget/KonvaButton";
import KonvaRatio from "../components/prototype/konvaWidget/KonvaRatio";
// import drawGrids from "@/components/prototype/grid/drawGrids";
// import Grid from "@/components/prototype/grid/Grid.vue";
// import { provide } from "vue";
// import axios from "axios";
// import qs from 'qs'
// import {prefixUrl} from "@/main";

let stage, layer
let isGroup

let currentElement = ref(null)

const contextMenuPosition = ref({ x: 0, y: 0 });
const selectedItem = ref(null);
const showContextMenu = ref(false);

const groups = []

onMounted(() => {

  const stageStringify = sessionStorage.getItem('stageStringify')

  console.log(stageStringify)

  if (stageStringify) {
    // TODO 重新打开插入的图片
    /*
      太NM复杂了，傻逼Konva，傻逼canvas，甚至不能序列化图片
      死给你看
     */

    const stageJSON = JSON.parse(stageStringify)
    stage = Konva.default.Node.create(stageJSON, 'canvasContainer');
    sessionStorage.removeItem('stageStringify')
  }
  else {
    stage = new Konva.default.Stage({
      container: 'canvasContainer',
      width: 950.4,
      // width: 1920,
      height: 534.6,
      // height: 1080
    });

    const bgLayer = new Konva.default.Layer();
    stage.add(bgLayer);

    // 创建一个背景矩形
    const backgroundRect = new Konva.default.Rect({
      width: stage.width(),
      height: stage.height(),
      fill: 'white', // 设置背景颜色
    });
    bgLayer.add(backgroundRect);
  }

  /*
  const bgLayer = new Konva.default.Layer();
  stage.add(bgLayer);

  // 创建一个背景矩形
  const backgroundRect = new Konva.default.Rect({
    width: stage.width(),
    height: stage.height(),
    fill: 'white', // 设置背景颜色
  });
  bgLayer.add(backgroundRect);

   */

  layer = new Konva.default.Layer();
  stage.add(layer);

  stage.on('click tap', function (e) {

    const isBackgroundLayer = () => {
      const layerWidth = e.target.attrs.width
      const layerHeight = e.target.attrs.height
      const stageWidth = e.currentTarget.attrs.width
      const stageHeight = e.currentTarget.attrs.height
      return layerHeight === stageHeight && layerWidth === stageWidth;
    }

    console.log(e)
    // if click on empty area - remove all transformers
    if (e.target === stage || isBackgroundLayer()) {
      stage.find('Transformer').forEach(tr => tr.destroy());
      layer.draw();
      return;
    }
    // remove old transformers
    stage.find('Transformer').forEach(tr => tr.destroy());

    // create new transformer
    const tr = new Konva.default.Transformer({
      ignoreStroke: true,
      padding: 5
    });
    layer.add(tr);
    tr.attachTo(e.target);
  });

  // 创建一个右键菜单图层
  const contextMenuLayer = new Konva.Layer();
  stage.add(contextMenuLayer);

  // 监听全局鼠标右键点击事件，设置右键菜单的位置和选中项
  window.addEventListener('contextmenu', (e) => {
    console.log(e)
    e.preventDefault();
    const stageBox = stage.container().getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    contextMenuPosition.value = {
      x: mouseX,
      y: mouseY
    }

    const inStageX = e.clientX - stageBox.left
    const inStageY = e.clientY - stageBox.top

    let clickedGroup = null;

    // 遍历所有组来寻找包含点击坐标的组
    for (const group of groups) {
      const groupBoundingBox = group.getClientRect();
      if (
        inStageX >= groupBoundingBox.x &&
        inStageX <= groupBoundingBox.x + groupBoundingBox.width &&
        inStageY >= groupBoundingBox.y &&
        inStageY <= groupBoundingBox.y + groupBoundingBox.height
      ) {
        clickedGroup = group;
        break; // 找到后立即退出循环
      }
    }

    if (clickedGroup) {
      isGroup = true
      selectedItem.value = clickedGroup
    }
    else {
      isGroup = false
      selectedItem.value = stage.getIntersection({
        x: inStageX,
        y: inStageY
      });
    }

    showContextMenu.value = selectedItem.value !== null;
    contextMenuLayer.draw();
  });

  // 监听全局点击事件，隐藏右键菜单
  window.addEventListener('click', () => {
    showContextMenu.value = false;
    contextMenuLayer.draw();
  });

  // 每隔0.1秒钟重新绘制
  setInterval(() => {
    layer.batchDraw();
  }, 100);
})

const deleteSelectedItem = () => {

  console.log("救命")

  if (isGroup) {
    selectedItem.value.remove()
    layer.batchDraw();
  }
  else {
    selectedItem.value.destroy();
    layer.batchDraw();
  }
}

const adjustMouseState = (element) => {
  element.on('mouseover', () => {
    stage.container().style.cursor = 'grab';
  });

  element.on('mouseout', () => {
    stage.container().style.cursor = 'default';
  });
}

const exportHTML = () => {
  const canvas = stage.toCanvas(); // 将 Konva.Stage 转换为 Canvas 元素

  const canvasDataURL = canvas.toDataURL(); // 获取 Canvas 元素的 Base64 数据

  const html = `
    <!DOCTYPE html>
    <html lang="en-US">
    <head>
      <title>Konva Canvas Export</title>
    </head>
    <body>
      <img src="${canvasDataURL}" alt="Exported Canvas">
    </body>
    </html>
  `;

  // 创建一个 Blob 对象，将 HTML 字符串放入其中
  const blob = new Blob([html], { type: 'text/html' });

  // 使用 FileSaver.js 将 Blob 对象保存为 HTML 文件
  saveAs(blob, 'exported_canvas.html');
}

const exportPng = () => {

  function dataURLToBlob(dataURL) {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const byteString = atob(parts[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([uint8Array], { type: contentType });
  }

  const dataURL = stage.toDataURL()
  const blob = dataURLToBlob(dataURL);
  saveAs(blob, 'konva_export.png');
}

const saveGraph = () => {
  const stageJSON = stage.toJSON()
  const stageStringify = JSON.stringify(stageJSON)
  console.log("-------------------------")
  console.log(stageJSON)
  console.log("-------------------------")

  const prototypeName = sessionStorage.getItem("prototypeName")
  sessionStorage.setItem('stageStringify', stageStringify)

  // TODO 向后端发送保存原型设计的接口
  /*
  axios.post('http://www.aamofe.top' + '/api/document/save_prototype/', qs.stringify({
    prototype_id: 2,
    content: stageStringify,
    title:prototypeName
  }),{
    headers:{
      Authorization: authStore().token;
    }
  })
    .then((response) => {
      if (response.status === 200) {
        console.log(response.data)
      }
    })

   */
}

const addText = () => {
  const text = new Konva.default.Text({
    x: 100,
    y: 100,
    text: '点击编辑文本内容',
    fontSize: 24,
    fontFamily: 'Arial',
    fill: 'black',
    draggable: true,
  })

  text.on('click', (e) => {
    currentElement.value = e.target
  })

  text.on('dblclick', () => {
    const textPosition = text.getAbsolutePosition();
    const stageBox = stage.container().getBoundingClientRect();

    const areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y
    };

    // create textarea and style it
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    textarea.value = text.text();
    textarea.style.position = 'absolute';
    textarea.style.top = areaPosition.y + 'px';
    textarea.style.left = areaPosition.x + 'px';
    textarea.style.width = text.width();

    textarea.focus();

    textarea.addEventListener('keydown', function (e) {
      // hide on enter
      if (e.keyCode === 13) {
        text.text(textarea.value);
        layer.draw();
        document.body.removeChild(textarea);
      }
    });
  });

  adjustMouseState(text)

  layer.add(text)
}

const addImage = () => {

  const convertToBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.src = reader.result;
        image.onload = () => {
          resolve(image);
        };
      };
      reader.readAsDataURL(file);
    });
  }

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';

  input.onchange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const base64Image = await convertToBase64(file);

      const image = new Konva.default.Image({
        x: 100,
        y: 100,
        image: base64Image,
        base64Image: base64Image,
        draggable: true,
      });

      const originalWidth = base64Image.width;
      const originalHeight = base64Image.height;
      const newWidth = (originalWidth / originalHeight) * 100;

      image.width(newWidth);
      image.height(100);

      adjustMouseState(image)

      layer.add(image);
      layer.draw();
    }
  };

  input.click();
}

const addButton = () => {
  const button = new KonvaButton({
    x: 100,
    y: 100,
    width: 150,
    height: 50,
    text: 'Click Me',
    draggable: true,
    cornerRadius: 50,
    fill: 'lightgray',
    onClick: () => {
      console.log("哈哈哈哈哈")
      // alert('Button Clicked!');
    },
  }, stage, layer)

  button.on('click', (e) => {
    console.log(e.target)
    currentElement.value = e.target.parent.children[0]
  })

  groups.push(button)
  layer.add(button)
}

const addInput = () => {
  const input = new KonvaInput({
    x: 100,
    y: 100,
    width: 200,
    height: 30,
    draggable: true
  })

  groups.push(input)
  layer.add(input)
}

const addRadio = () => {

  const stageBox = stage.container().getBoundingClientRect();

  const select = new KonvaRatio({
    x: 100,
    y: 100,
    width: 200,
    height: 30,
    draggable: true
  }, stageBox);

  groups.push(select)
  layer.add(select)
}

const addRect = () => {
  const rect = new Konva.default.Rect({
    x: 100,
    y: 100,
    width: 150,
    height: 100,
    fill: "#7f9ac7",
    strokeWidth: 0.01,
    stroke: "#000000",
    draggable: true
  })

  rect.on('click', (e) => {
    console.log(e.target)
    currentElement.value = e.target
  })

  layer.add(rect)
}

const setGraphSize = ({ width, height }) => {
  stage.width(width)
  stage.height(height)
}

</script>

<template>
  <div class="prototype-design">
    <div class="left-bar-outer">
      <LeftBar :set-graph-size="setGraphSize" :add-text="addText" :add-image="addImage" :add-button="addButton"
        :add-input="addInput" :add-radio="addRadio" :add-rect="addRect" :current-element="currentElement" />
    </div>
    <div class="middle-and-bottom">
      <div class="middle-draw-outer">
        <div class="middle-draw">
          <div class="contain-outer">
            <!--
            <Grid style="width: 76%; height: 100%" />
            -->
            <div class="canvasContainer" id="canvasContainer">
            </div>
          </div>
          <div class="tool-outer">
            <Tools :save-graph="saveGraph" :export-png="exportPng" :export-html="exportHTML"
              :current-element="currentElement" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showContextMenu" :style="{
    position: 'absolute',
    left: `${contextMenuPosition.x + 10}px`,
    top: `${contextMenuPosition.y + 10}px`,
    display: showContextMenu ? 'block' : 'none',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  }">
    <div @click="deleteSelectedItem">Delete</div>
  </div>
</template>

<style scoped lang="scss">
.prototype-design {
  position: fixed;
  top: 15vh;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  background-color: #f8f8f8;

  .left-bar-outer {
    height: 100%;
    width: 20%;
  }

  .middle-and-bottom {
    height: 100%;
    width: 80%;

    .middle-draw-outer {
      width: 100%;
      height: 100%;

      .middle-draw {
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: nowrap;

        .contain-outer {
          height: 100%;
          width: 95%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 5px;

          .canvasContainer {
            border-radius: 5px;
            background-color: white;
          }
        }

        .tool-outer {
          height: 100%;
          width: 5%;
        }
      }
    }
  }
}
</style>
