<script setup>
import LeftBar from "../components/prototype/left/LeftBar.vue";
import * as Konva from "konva";
import {inject, onMounted, ref} from "vue";
import {saveAs} from 'file-saver'
import Tools from "../components/prototype/right/Tools.vue";
import KonvaInput from "../components/prototype/konvaWidget/KonvaInput";
import KonvaButton from "../components/prototype/konvaWidget/KonvaButton";
import KonvaRadio from "../components/prototype/konvaWidget/KonvaRadio";
import {authStore} from "../store/index";
import axios from "axios";
import {useRoute} from 'vue-router';
import qs from "qs";
import PreviewPrototype from "../components/prototype/preview/PreviewPrototype.vue";
import KonvaRect from "@/components/prototype/konvaWidget/KonvaRect";
import KonvaText from "@/components/prototype/konvaWidget/KonvaText";
import KonvaSwitch from "@/components/prototype/konvaWidget/KonvaSwitch";
import KonvaSlider from "@/components/prototype/konvaWidget/KonvaSlider";
import KonvaSelect from "@/components/prototype/konvaWidget/KonvaSelect";
import KonvaInputNumber from "@/components/prototype/konvaWidget/KonvaInputNumber";
import {ElMessage} from "element-plus";
import KonvaImage from "@/components/prototype/konvaWidget/KonvaImage";

const route = useRoute();
const designId = route.params.id;
const parentFolderId = route.params.parentFolderId

let stage, layer
let isGroup

const currentElement = ref(null)
const isPreviewOpen = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 });
const selectedItem = ref(null);
const showContextMenu = ref(false);
const prototypeTitle = ref(null)
const previewPrototypeToken = ref('')
const initialSize = ref(null)
const isTemplate = ref(false)

const groups = []

const beautifulAxios = inject('axios')

onMounted(() => {

  const stageStringify = sessionStorage.getItem('stageStringify')

  // console.log(stageStringify)

  // 本地有从本地拿
  if (stageStringify) {
    /*
      太NM复杂了，傻逼Konva，傻逼canvas，甚至不能序列化图片
      死给你看
     */
    // console.log(stageStringify)
    const stageJSON = JSON.parse(stageStringify)
    // console.log(stageJSON)
    stage = Konva.default.Node.create(stageJSON, 'canvasContainer');

    stage.find('Image').forEach((imageNode) => {
      const src = imageNode.getAttr('src');
      const image = new Image();
      image.onload = () => {
        imageNode.image(image);
        imageNode.getLayer().batchDraw();
      }
      image.src = src;
    });

    sessionStorage.removeItem('stageStringify')
  }
  // 本地没有从服务端拿
  else {
    const token = authStore().token

    let Headers = { 'Authorization': token };

    let formerContent = ''

    axios.get('http://www.aamofe.top/api/document/view_prototype/' + designId, {
      headers: Headers,
      params: {
        prototype_id: designId
      }
    })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data)

          formerContent = response.data.prototype.content
          prototypeTitle.value = response.data.prototype.title
          const width = response.data.prototype.width
          const height = response.data.prototype.height
          initialSize.value = {
            width: width,
            height: height
          }
          isTemplate.value = response.data.prototype.is_template

          if (formerContent) {
            const stageJSON = JSON.parse(formerContent)
            // console.log(stageJSON)
            stage = Konva.default.Stage.create(stageJSON, 'canvasContainer');
            stage.width(width)
            stage.height(height)
            stage.children.forEach((item) => {
              if (item.children.length === 0) {
                item.destroy()
              }
              else if (item.children.at(0) instanceof Konva.default.Group &&
                item.children.at(0).getChildren().length === 0) {
                item.destroy()
              }
            })

            /*
              这样行不行，只有天知道
             */
            // 遍历舞台上的所有节点
            stage.find(node => {

              // 检查节点的类型
              if (node.attrs.defineType === 'KonvaImage') {
                const myShape = new KonvaImage(node.getAttrs());
                node.parent.add(myShape);
                node.destroy();
              }
              else if (node.attrs.defineType === 'KonvaSwitch') {
                const myShape = new KonvaSwitch(node.getAttrs());
                node.parent.add(myShape);
                groups.push(myShape)
                node.destroy();
              }
              else if (node.attrs.defineType === 'KonvaButton') {
                const myShape = new KonvaButton(node.getAttrs());
                node.parent.add(myShape);
                groups.push(myShape)
                node.destroy();
              }
              else if (node.attrs.defineType === 'KonvaInput') {
                const myShape = new KonvaInput(node.getAttrs());
                // 将新创建的实例添加到舞台中
                node.parent.add(myShape);
                // 删除原来的节点
                groups.push(myShape)
                node.destroy();
              }
              else if (node.attrs.defineType === 'KonvaInputNumber') {
                const myShape = new KonvaInputNumber(node.getAttrs());
                myShape.on('click', (e) => {
                  currentElement.value = e.currentTarget
                })
                node.parent.add(myShape);
                groups.push(myShape)
                node.destroy();
              }
              else if (node.attrs.defineType === 'KonvaRadio') {
                const myShape = new KonvaRadio(node.getAttrs());
                myShape.on('click', (e) => {
                  currentElement.value = e.currentTarget
                })
                node.parent.add(myShape);
                groups.push(myShape)
                node.destroy();
              }
              else if (node.attrs.defineType === 'KonvaRect') {
                const myShape = new KonvaRect(node.getAttrs());
                myShape.on('click', (e) => {
                  currentElement.value = e.currentTarget
                })
                node.parent.add(myShape);
                // groups.push(myShape)
                node.destroy();
              }
              else if (node.attrs.defineType === 'KonvaSelect') {
                const myShape = new KonvaSelect(node.getAttrs());
                myShape.on('click', (e) => {
                  currentElement.value = e.currentTarget
                })
                node.parent.add(myShape);
                groups.push(myShape)
                node.destroy();
              }
              else if (node.attrs.defineType === 'KonvaText') {
                const myShape = new KonvaText(node.getAttrs());
                myShape.on('click', (e) => {
                  currentElement.value = e.currentTarget
                })
                node.parent.add(myShape);
                // groups.push(myShape)
                node.destroy();
              }
              else if (node.attrs.defineType === 'KonvaSlider') {
                const myShape = new KonvaSlider(node.getAttrs());
                myShape.on('click', (e) => {
                  currentElement.value = e.currentTarget
                })
                node.parent.add(myShape);
                groups.push(myShape)
                node.destroy();
              }
            });


            stage.find('Image').forEach((imageNode) => {
              const src = imageNode.getAttr('src');
              const image = new Image();
              image.onload = () => {
                imageNode.image(image);
                imageNode.getLayer().batchDraw();
              }
              image.src = src;
            });

            stage.find('KonvaImage').forEach((image) => {
              image.insertEventListener()
            })

            console.log(stage.getLayers())
            sessionStorage.removeItem('stageStringify')
          }
          else {
            stage = new Konva.default.Stage({
              container: 'canvasContainer',
              // width: 950.4,
              // height: 534.6,
              width: 1920,
              height: 1080,
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

        }
      })
  }

})

const deleteSelectedItem = () => {

  console.log("救命")

  if (isGroup) {
    selectedItem.value.destroy()
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
  const htmlElements = [];
  const htmlData = []

  // 遍历舞台上的图层和图形
  stage.getChildren().forEach(layer => {
    layer.getChildren().forEach(shape => {
      console.log(shape)
      // 转换Konva图形为对应的HTML元素
      if (shape instanceof KonvaRect) {
        htmlElements.push(shape.exportHTMLString());
      }
      else if (shape instanceof KonvaText) {
        htmlElements.push(shape.exportHTMLString());
      }
      else if (shape instanceof KonvaButton) {
        htmlElements.push(shape.exportHTMLString())
      }
      else if (shape instanceof KonvaInput) {
        htmlElements.push(shape.exportHTMLString())
      }
      else if (shape instanceof KonvaSwitch) {
        htmlElements.push(shape.exportHTMLString())
        htmlData.push(shape.exportHTMLDate())
      }
      else if (shape instanceof KonvaSlider) {
        htmlElements.push(shape.exportHTMLString())
        htmlData.push(shape.exportHTMLDate())
      }
      else if (shape instanceof KonvaInputNumber) {
        htmlElements.push(shape.exportHTMLString())
        htmlData.push(shape.exportHTMLDate())
      }
      else if (shape instanceof KonvaRadio) {
        htmlElements.push(shape.exportHTMLString())
        htmlData.push(shape.exportHTMLData())
      }
      else if (shape instanceof KonvaSelect) {
        htmlElements.push(shape.exportHTMLString())
        htmlData.push(shape.exportHTMLDate())
      }
      else if (shape instanceof KonvaImage) {
        htmlElements.push(shape.exportHTMLString())
      }
      // 添加更多图形类型的转换逻辑
    });
  });

  // 创建HTML代码
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      <script src="https://unpkg.com/vue@next"><\/script>
      <link rel="stylesheet" href="https://unpkg.com/element-plus/dist/index.css">
      <script src="https://unpkg.com/element-plus"><\/script>
      <title>Converted Canvas to HTML</title>
    </head>
    <body>
      <div id="app">
        ${htmlElements.join('\n')}
      </div>
      <script>
        const App = {
          data() {
            return {
              ${htmlData.join('\n')}
            };
          },
        };
        const app = Vue.createApp(App);
        app.use(ElementPlus);
        app.mount("#app");
      <\/script>
    </body>
    </html>
  `;

  // 保存HTML内容为文件
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  saveAs(blob, "file.html");
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
  // console.log(stageJSON)
  console.log("-------------------------")

  const prototypeName = sessionStorage.getItem("prototypeName")
  sessionStorage.setItem('stageStringify', stageStringify)

  console.log(stage)

  axios.post('http://www.aamofe.top/api/document/save/', qs.stringify({
    file_type: "prototype",
    file_id: designId,
    parent_folder_id: parentFolderId,
    content: stageStringify,
    title: prototypeName,
    width: stage.attrs.width,
    height: stage.attrs.height
  }),{
    headers:{
      Authorization: authStore().token
    }
  })
    .then((response) => {
      if (response.status === 200) {
        if (response.data.errno === 0) {
          ElMessage({
            message: "保存成功",
            type: "success"
          })
        }
      }
    })
}

const addText = () => {
  const text = new KonvaText({
    x: 100,
    y: 100,
    text: '点击编辑文本内容',
    fontSize: 24,
    fontFamily: 'Arial',
    fill: 'black',
    draggable: true,
  })

  text.on('click', (e) => {
    console.log(e)
    currentElement.value = e.currentTarget
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

      const originalWidth = base64Image.width;
      const originalHeight = base64Image.height;
      const newWidth = (originalWidth / originalHeight) * 100;

      const image = new KonvaImage({
        x: 100,
        y: 100,
        height: 100,
        width: newWidth,
        image: base64Image,
        base64Image: base64Image,
        draggable: true,
      });

      adjustMouseState(image)

      console.log(file)
      console.log(base64Image)
      const formData = new FormData()
      formData.append('file_type', 'prototype')
      formData.append('file', file)
      axios.post('http://www.aamofe.top/api/document/upload/', formData, {
        headers:{
          Authorization: authStore().token
        }
      }).then((response) => {
        if (response.status === 200) {
          if (response.data.errno === 0) {
            ElMessage({
              message: "图片上传成功",
              type: "success"
            })
            image.setAttr('src', response.data.url)
            console.log(image)
          }
        }
      })

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

  // const stageBox = stage.container().getBoundingClientRect();

  const radio = new KonvaRadio({
    x: 100,
    y: 100,
    width: 200,
    height: 30,
    draggable: true,
    options: [
      { label: 'Option A', value: 'Option A' }
    ],
  });

  radio.on('click', (e) => {
    console.log(e)
    currentElement.value = e.currentTarget
  })

  groups.push(radio)
  layer.add(radio)
}

const addRect = () => {
  // const rect = new Konva.default.Rect({
  //   x: 100,
  //   y: 100,
  //   width: 150,
  //   height: 100,
  //   fill: "#7f9ac7",
  //   strokeWidth: 0.01,
  //   stroke: "#000000",
  //   draggable: true
  // })

  const rect = new KonvaRect({
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

const addSwitch = () => {
  const newSwitch = new KonvaSwitch({
    x: 100,
    y: 100,
    draggable: true
  })

  groups.push(newSwitch)

  layer.add(newSwitch)
}

const addSlider = () => {
  const slider = new KonvaSlider({
    x: 100,
    y: 100,
    width: 100,
    height: 10,
    min: -10,
    max: 10,
    draggable: true
  })

  slider.on('click', (e) => {
    console.log(e)
    currentElement.value = e.currentTarget
  })

  layer.add(slider)
}

const addSelect = () => {
  const select = new KonvaSelect({
    x: 100,
    y: 100,
    options: [
      { label: 'Option A', value: 'Option A' },
    ],
    draggable: true
  }, layer)

  select.on('click', (e) => {
    console.log(e)
    currentElement.value = e.currentTarget
  })

  layer.add(select)
}

const addInputNumber = () => {
  const inputNumber = new KonvaInputNumber({
    x: 100,
    y: 100,
    width: 120,
    height: 30,
    min: 0,
    max: 100,
    draggable: true
  })

  inputNumber.on('click', (e) => {
    console.log(e)
    currentElement.value = e.currentTarget
  })

  layer.add(inputNumber)
}

const setGraphSize = ({ width, height }) => {
  stage.width(width)
  stage.height(height)
}

const saveAsTemplate = () => {

  const stageJSON = stage.toJSON()
  const stageStringify = JSON.stringify(stageJSON)

  beautifulAxios.post('/document/save_as_template/', qs.stringify({
    content: stageStringify,
    title: prototypeTitle.value,
    file_type: "prototype",
    width: stage.attrs.width,
    height: stage.attrs.height
  }))
    .then((response) => {
      if (response.status === 200) {
        if (response.data.errno === 0) {
          ElMessage({
            message: "导出成功",
            type: "success"
          })
        }
      }
    })
}

// TODO 预览
const handlePreviewPrototype = () => {

  const Headers = { 'Authorization': authStore().token }

  axios.post('http://www.aamofe.top/api/document/share_prototype/', qs.stringify({
    prototype_id: designId,
    visible: "1"
  }), {
    headers: Headers
  })
    .then((response) => {
      if (response.status === 200) {
        if (response.data.errno === 0) {
          previewPrototypeToken.value = response.data.token
          console.log(previewPrototypeToken.value)
          isPreviewOpen.value = true
        }
      }
    })
}

</script>

<template>
  <div class="prototype-design">
    <div class="left-bar-outer">
      <LeftBar
        :initial-size="initialSize"
        :set-graph-size="setGraphSize"
        :add-text="addText"
        :add-image="addImage"
        :add-button="addButton"
        :add-input="addInput"
        :add-radio="addRadio"
        :add-rect="addRect"
        :add-switch="addSwitch"
        :add-slider="addSlider"
        :add-select="addSelect"
        :add-input-number="addInputNumber"
        :current-element="currentElement"
        :prototype-title="prototypeTitle"
      />
    </div>
    <div class="middle-and-bottom">
      <div class="middle-draw-outer">
        <div class="middle-draw">
          <div class="contain-outer">
            <div class="canvas-container" id="canvasContainer">
            </div>
          </div>
          <div class="tool-outer">
            <Tools
              :save-graph="saveGraph"
              :export-png="exportPng"
              :export-html="exportHTML"
              :current-element="currentElement"
              :save-as-template="saveAsTemplate"
              :preview-prototype="handlePreviewPrototype"
              :is-template="isTemplate"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <el-dialog style="height: 70vh; width: 60vw; background-color: #8c939d" v-model="isPreviewOpen">
    <PreviewPrototype :prototype-token="previewPrototypeToken"/>
  </el-dialog>
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
  top: 5vh;
  height: 95vh;
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
          .canvas-container {
            border-radius: 5px;
            background-color: white;
            max-width: 950.4px;
            max-height: 534.6px;
            overflow: auto;
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
