import { defineStore } from "pinia";

const usePrototypeStore =  defineStore('prototype', {
  state: () => {
    return {
      activityId: '',
      pageConfigId: '',
      pageTitle: '',
      canvasSize: {
        width: 338,
        height: 600
      },
      canvasPosition: {
        top: null,
        left: null
      },
      background: null,
      // 组件列表
      posterItems: [],
      // 当前选中的组件
      activeItems: [],
      // 辅助组件
      assistWidgets: [],
      // 是否打开图层面板
      layerPanelOpened: true,
      // 是否打开参考线
      referenceLineOpened: true,
      // 当前复制的组件 WidgetItem[]
      copiedWidgets: null,
      // 参考线,用户定义的参考线
      referenceLine: {
        row: [],
        col: []
      },
      // 匹配到的参考线 {row:[],col:[]}
      matchedLine: null,
      mainPanelScrollY: 0,
      // 是否处于未保存状态
      isUnsavedState: false
    }
  },
  actions: {
    addItem(item) {
      this.posterItems.push(item)
    }
  }
})

export { usePrototypeStore }