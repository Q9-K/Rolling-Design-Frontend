<!--
 * @Date: 2023-08-25 21:07:30
 * @Author: Q9K
 * @Description: 
-->
<template>
    <div class="box">
        <div class="header">
            <div class="actions1">
                <el-button @click="router.back()">
                    <el-icon>
                        <ArrowLeftBold />
                    </el-icon>
                </el-button>
                <div class="select"></div>
            </div>
            <div class="file_title"></div>
            <div class="actions2">
                <el-button @click="downloadFile(editor.editor.storage.markdown.getMarkdown())">
                    <el-icon>
                        <Download />
                    </el-icon>
                </el-button>
            </div>
            <div class="userlist"></div>
        </div>
        <el-tiptap v-model:content="content" :extensions="extensions" placeholder="欢迎使用Rolling Editor!👏" ref="editor" />
    </div>
</template>
  
<script setup>
import { ref, watch, onMounted, onUpdated } from 'vue';
import { ArrowLeftBold, Download } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router';
import {
    Document,
    Text,
    Paragraph,
    Bold,
    Italic,
    Strike,
    Underline,
    Image,
    CodeBlock,
    Blockquote,
    BulletList,
    OrderedList,
    TaskList,
    TextAlign,
    Indent,
    HardBreak,
    HorizontalRule,
    Table,
    History,
    Color,
    Print,
    Highlight,
    SelectAll,
} from 'element-tiptap';
import {
    Heading,
    FontFamily,
    FontSize,
    Fullscreen,
} from 'element-tiptap-vue3-fixed'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { Markdown } from 'tiptap-markdown'

const provider = new HocuspocusProvider({
    url: 'ws://127.0.0.1:1234',
    name: 'example-document',
})
const extensions = [
    History,
    Document,
    Text,
    Paragraph,
    Heading,
    Bold.configure({
        bubble: true
    }),
    Italic.configure({
        bubble: true
    }),
    Strike,
    Underline.configure({
        bubble: true
    }),
    Image,
    CodeBlock,
    Blockquote,
    BulletList,
    OrderedList,
    TaskList,
    TextAlign,
    Indent,
    HardBreak,
    HorizontalRule,
    Table,
    Color,
    Print,
    Highlight,
    SelectAll,
    FontSize,
    FontFamily,
    Fullscreen,
    Markdown,
    Collaboration.configure({
        document: provider.document,
    }),
    // Register the collaboration cursor extension
    CollaborationCursor.configure({
        provider: provider,
        user: {
            name: 'Cyndi Lauper',
            color: '#f783ac',
        },
    }),
];

const router = useRouter()


// editor's content
const content = ref(null);
const editor = ref('')

// watch(content, (newval, oldval) => {
//     console.log(editor.value.editor.storage.markdown.getMarkdown())
// }, {
//     immediate: true
// })

const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.md`;
    link.click();
    URL.revokeObjectURL(link.href);
}
onMounted(() => {
    console.log(editor.value.editor.storage.markdown.getMarkdown())
})
onUpdated(() => {
    console.log(editor.value.editor.storage.markdown.getMarkdown())
})

</script>

<style lang="scss">
.box {
    height: 100%;
    display: flex;
    flex-direction: column;

    .header {
        height: 56px;
        background-color: #f9fafb;
        padding: 0 4px;
        border-bottom: 2px solid #346d9b75;
        display: flex;
    }
}




//共享光标样式
.collaboration-cursor__caret {
    border-left: 1px solid #0D0D0D;
    border-right: 1px solid #0D0D0D;
    margin-left: -0.5px;
    margin-right: -0.5px;
    pointer-events: none;
    position: relative;
    word-break: normal;
}

.collaboration-cursor__label {
    border-radius: 3px 3px 3px 0;
    color: #0D0D0D;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    left: -1px;
    line-height: normal;
    padding: 0.1rem 0.3rem;
    position: absolute;
    top: -1.4em;
    user-select: none;
    white-space: nowrap;
}

.el-tiptap-editor__menu-bar {
    width: 100%;
    margin: 0 auto;
    justify-content: center;
    // line-height: 20px;
    height: 44px;
    background: #f9fafb;
    padding-top: 8px;
    padding-bottom: 8px;
    box-sizing: border-box;
    border: none;
}


.el-tiptap-editor__menu-bubble--active {
    background-color: #fff;
    padding: 2px 6px;
    border: none;
    border-radius: 20px;

    .el-tiptap-editor__command-button {
        height: 18px;
        width: 18px;
        margin-left: 7px;
        margin-right: 7px;

        svg {
            width: 12px;
            height: 12px;
        }
    }

}

.el-tiptap-editor__command-button {
    height: 24px;
    width: 24px;
    padding: 2px;
    background: transparent;
    margin-left: 10px;
    margin-right: 10px;

    svg {
        width: 20px;
        height: 20px;
    }

}

.el-tiptap-editor {
    background-color: #f3f5f7;
    box-sizing: border-box;
    overflow: hidden;
    flex: 1;

    * {
        caret-color: #3409f7;
    }
}

.el-tiptap-editor__footer {
    justify-content: space-between;
    height: 32px;
    position: sticky;
    bottom: 0;
    padding: 0 16px;

    .el-tiptap-editor__characters {
        font-size: 14px;
        font-weight: 700;
    }
}

.el-tiptap-editor--with-footer>.el-tiptap-editor__content {
    flex: 1;
    width: 60%;
    padding: 20px 30px;
    // max-width: min-content;
    word-wrap: break-word;
    overflow-wrap: break-word;
    overflow-x: hidden;
    margin: 0 auto;
    background-color: #ffffff;
    /* border-radius: 20px; */
    border-bottom: none;
    box-shadow: 10px 0px 10px #dad8d9, -10px 0px 10px #dad8d9;
}

.el-tiptap-dropdown-menu .el-tiptap-dropdown-menu__item {
    // width: 20px;
    padding: 4px 5px;
    box-sizing: border-box;
    line-height: 18px;

    span {
        text-align: center;
    }
}

.el-tiptap-popper__menu__item {
    padding: 4px 0;
    line-height: 18px;
}
</style>
