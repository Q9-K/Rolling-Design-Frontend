import { usePDF } from "vue3-pdfmake"
import TurndownService from 'turndown'

const PAGE_MARGIN = 10;
const pdfmake = usePDF({
    autoInstallVFS: true
})
export default async function (fileType, fileContent, title, editorInstance) {
    // let fileSuffix = ''
    let blob
    if (fileType == 'json') {
        // fileSuffix = 'json'
        const jsonContent = JSON.stringify(editorInstance.getJSON(), null, 2)
        blob = new Blob([jsonContent], { type: 'application/json' })
    }
    else if (fileType == 'md') {
        const turndownService = new TurndownService()
        const markdownContent = turndownService.turndown(fileContent)
        blob = new Blob([markdownContent], { type: 'text/plain;charset=utf-8' })
    }
    else if (fileType == 'doc') {

    }
    else if (fileType == 'html') {
        const htmlContent = editorInstance.getHTML()
        blob = new Blob([htmlContent], { type: 'text/html' })
    }
    else if (fileType == 'pdf') {
        pdfmake.createPdf({
            content: fileContent
        }).download()
    }
    if (fileType != 'pdf') {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${title}.${fileType}`;
        link.click();
        URL.revokeObjectURL(link.href);
    }
}