/*
 * @Date: 2023-08-28 02:14:26
 * @Author: Q9K
 * @Description: 
 */
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia