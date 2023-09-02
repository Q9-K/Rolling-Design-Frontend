/*
 * @Date: 2023-09-01 20:51:18
 * @Author: Q9K
 * @Description: 
 */
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

class YjsService {
    wsp;
    mouseTracker;

    getConnectedDoc(fileID) {
        const doc = new Y.Doc();
        this.wsp = new WebsocketProvider('ws://localhost:1234', fileID, doc);

        return new Promise((res, rej) => {
            this.wsp.on("status", e => {
                e.status === "connected" ? this.wsp.on("sync", () => res(doc)) : rej()
            });
        });
    }

    startAwareness({ username, listener }) {
        this.wsp.awareness.setLocalState({ user: { name: username, color: 'blue' }, Cursor: { x: 0, y: 0 } });
        this.wsp.awareness.on("change", changes => {
            listener.apply(null, [changes, this.wsp.awareness.getStates()]);
        });

        this.mouseTracker = event => {
            const state = this.wsp.awareness.getLocalState()
            state.Cursor.x = event.pageX;
            state.Cursor.y = event.pageY;
            this.wsp.awareness.setLocalState(state);
        };
        window.addEventListener("mousemove", this.mouseTracker);
    }

    stopAwareness() {
        this.wsp.awareness.destroy();
        window.removeEventListener("mousemove", this.mouseTracker);
    }

}

export default YjsService;