import { message } from 'antd'
import { DragEvent, useState } from 'react'

export const useAreaUpload = () => {
  const [fileDragEnter, setFileDragEnter] = useState(false)
  const [fileDragDrop, setFileDragDrop] = useState(false)
  const [file, setFile] = useState<File>()
  const onDragEnter = (e: DragEvent) => {
    setFile(undefined)
    setFileDragEnter(true)
    setFileDragDrop(false)
    e.preventDefault()
    e.stopPropagation()
    return false
  }
  const onDragOver = (e: DragEvent) => {
    e.dataTransfer.dropEffect = 'copy' // 兼容某些三方应用，如圈点
    e.preventDefault()
    e.stopPropagation()
    return false
  }

  const onDragleave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    return false
  }

  // 获得拖拽文件的回调函数
  function getDropFileCallBack(dropFiles: File[]) {
    console.log(dropFiles, dropFiles.length)
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setFileDragDrop(true)
    var df = e.dataTransfer
    var dropFiles: File[] = [] // 拖拽的文件，会放到这里
    var dealFileCnt = 0 // 读取文件是个异步的过程，需要记录处理了多少个文件了
    var allFileLen = df.files.length // 所有的文件的数量，给非Chrome浏览器使用的变量

    // 检测是否已经把所有的文件都遍历过了
    function checkDropFinish() {
      if (dealFileCnt === allFileLen - 1) {
        getDropFileCallBack(dropFiles)
      }
      dealFileCnt++
    }

    if (df.items !== undefined) {
      // Chrome拖拽文件逻辑
      for (var i = 0; i < df.items.length; i++) {
        var item = df.items[i]
        if (item.kind === 'file' && item.webkitGetAsEntry()?.isFile) {
          var file = item.getAsFile()
          if (file) {
            dropFiles.push(file)
          }
        }
      }
    } else {
      // 非Chrome拖拽文件逻辑
      for (var i = 0; i < allFileLen; i++) {
        var dropFile = df.files[i]
        if (dropFile.type) {
          dropFiles.push(dropFile)
          checkDropFinish()
        } else {
          try {
            var fileReader = new FileReader()
            fileReader.readAsDataURL(dropFile.slice(0, 3))

            fileReader.addEventListener(
              'load',
              function (e) {
                console.log(e, 'load')
                dropFiles.push(dropFile)
                checkDropFinish()
              },
              false
            )

            fileReader.addEventListener(
              'error',
              function (e) {
                console.log(e, 'error，不可以上传文件夹')
                checkDropFinish()
              },
              false
            )
          } catch (e) {
            console.log(e, 'catch error，不可以上传文件夹')
            checkDropFinish()
          }
        }
      }
    }
    if (dropFiles.length >= 2) {
      message.error('一次最多上传一个文件')
      setFileDragDrop(false)
      setFileDragEnter(false)
      return
    }
    setFile(dropFiles[0])
  }

  return {
    fileDragEnter,
    file,
    fileDragDrop,
    setFileDragDrop,
    setFileDragEnter,
    onDragEnter,
    onDragOver,
    onDragleave,
    onDrop,
  }
}
