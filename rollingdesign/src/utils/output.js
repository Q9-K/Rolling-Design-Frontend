/*
 * @Date: 2023-09-01 11:46:33
 * @Author: Q9K
 * @Description: 
 */
import TurndownService from 'turndown'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { asBlob } from 'html-docx-js-typescript'
import saveAs from 'file-saver'

export default async function (fileType, fileContent, title, editorContentDom, editorInstance) {
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
    else if (fileType == 'docx') {
        // blob = await richToWord(fileContent)
        const content = fileContent.replace(/<strong>/g, '<b>')
            .replace(/<\/strong>/g, '</b>')
            // 背景色不生效问题
            .replace(/<mark/g, '<span')
            .replace(/<\/mark>/g, '</span>')
        const data = await asBlob(fileContent, { type: 'text/html;charset=utf-8' })
        saveAs(data, `${title}.docx`)


    }
    else if (fileType == 'html') {
        const htmlContent = editorInstance.getHTML()
        blob = new Blob([htmlContent], { type: 'text/html' })
    }
    else if (fileType == 'pdf') {
        console.log("🚀 ~ file: output.js:47 ~ editorInstance:", editorContentDom)
        let canvas = await html2canvas(editorContentDom, {
            useCORS: true,
            allowTaint: true
        })
        let contentWidth = canvas.width
        let contentHeight = canvas.height
        let pageHeight = contentWidth / 592.28 * 841.89
        let leftHeight = contentHeight
        let position = 0
        let imgWidth = 595.28
        let imgHeight = 592.28 / contentWidth * contentHeight
        let pageData = canvas.toDataURL('image/jpeg', 1.0)
        let PDF = new jsPDF('', 'pt', 'a4')
        if (leftHeight < pageHeight) {
            PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        } else {
            while (leftHeight > 0) {
                PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                leftHeight -= pageHeight
                position -= 841.89
                if (leftHeight > 0) {
                    PDF.addPage()
                }
            }
        }
        PDF.save(title + '.pdf')
    }
    if (fileType == 'md' || fileType == 'html' || fileType == 'json') {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${title}.${fileType}`;
        link.click();
        URL.revokeObjectURL(link.href);
    }
}