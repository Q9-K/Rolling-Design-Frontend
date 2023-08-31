/*
 * @Date: 2023-08-26 22:01:58
 * @Author: Q9K
 * @Description: 
 */
import { VueRenderer } from '@tiptap/vue-3'
import tippy from 'tippy.js'
import { reactive, ref, inject } from 'vue'
import MentionList from '../components/MentionList.vue'
const axios = inject('axios')
import { authStore } from "../store/index.js"

export default {
    items: async ({ query }) => {
        const array = authStore().team_members
        const userId = authStore().userId
        return array.filter(item => (item.id != userId && item.username.toLowerCase().startsWith(query.toLowerCase())))
    },

    render: () => {
        let component
        let popup

        return {
            onStart: props => {
                component = new VueRenderer(MentionList, {
                    props,
                    editor: props.editor,
                })

                if (!props.clientRect) {
                    return
                }

                popup = tippy('body', {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                })
            },

            onUpdate(props) {
                component.updateProps(props)

                if (!props.clientRect) {
                    return
                }

                popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                })
            },

            onKeyDown(props) {
                if (props.event.key === 'Escape') {
                    popup[0].hide()
                    return true
                }
                // console.log(component.ref.onKeyDown(props))
                return component.ref?.onKeyDown(props)
            },

            onExit() {
                // console.log(popup[0].popper)
                popup[0].destroy()
                component.destroy()
            },
        }
    },
}


