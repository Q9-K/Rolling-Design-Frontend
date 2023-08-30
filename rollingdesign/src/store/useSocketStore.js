import { defineStore } from 'pinia'


export const useSocketStore = defineStore('socketStore', {
    state: () => {
        return {
            socket: null
        }
    },
    actions: {
        sendMessage(msg) {
            socket.send(msg)
        }
    }
})