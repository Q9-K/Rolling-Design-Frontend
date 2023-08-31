/*
 * @Date: 2023-09-01 05:24:02
 * @Author: Q9K
 * @Description: 
 */
import { Node } from 'tiptap';
import { replaceTextSelection } from 'tiptap-commands';

export default class CustomImageNode extends Node {
    get name() {
        return 'customImage';
    }

    get schema() {
        return {
            attrs: {
                src: {
                    default: null,
                },
                alt: {
                    default: null,
                },
            },
            group: 'block',
            selectable: false,
            draggable: true,
            atom: true,
            toDOM: node => ['img', { src: node.attrs.src, alt: node.attrs.alt }],
            parseDOM: [{
                tag: 'img[src]',
                getAttrs: dom => ({
                    src: dom.getAttribute('src'),
                    alt: dom.getAttribute('alt'),
                }),
            }],
        };
    }

    commands() {
        return {
            insertCustomImage: (src, alt) => ({ tr, dispatch }) => {
                const placeholder = '![Uploading...]'; // 临时占位符

                dispatch(replaceTextSelection(tr, this.type.create({ src: placeholder, alt })));

                // 调用上传方法
                this.options.upload(src, alt)
                    .then(imageUrl => {
                        // 上传成功后，将占位符替换为实际的图片节点
                        const { state, dispatch } = this.editor;
                        const { from, to } = state.selection;
                        const imageNode = this.type.create({ src: imageUrl, alt });

                        dispatch(
                            tr
                                .replaceRangeWith(from, to, imageNode)
                                .setMeta('addToHistory', false)
                        );
                    })
                    .catch(error => {
                        // 上传失败，可以根据需要进行错误处理
                        console.error('上传失败:', error);
                    });
            },
        };
    }
}