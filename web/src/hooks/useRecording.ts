import { useEffect, useState } from 'react'

export const useRecording = (fileCallBack: (file: File, setSecond: number) => void) => {
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  let timer: any
  let second = 0
  /**
   * 重置
   **/
  const reset = () => {
    setIsRecording(false)
    setMediaRecorder(null)
    second = 0
    if (timer) clearInterval(timer)
  }

  useEffect(() => {
    return () => {
      // 清理函数，确保在组件卸载时停止媒体流和计时器
      stop()
      reset()
    }
  }, [])

  /**
   * 开始录制
   * @return Blob 录制的WAV音频数据
   **/
  const start = async () => {
    try {
      let audioChunks: Blob[] = []
      // 获取音频流
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // 处理音频数据
          audioChunks.push(event.data)
        }
      }
      if (timer) clearInterval(timer)
      timer = setInterval(() => {
        second++
      }, 1000)

      recorder.onstop = () => {
        // 处理录制完成的音频数据
        const blob = new Blob(audioChunks, { type: 'audio/mpeg' })
        // 封装成文件
        const file = new File([blob], `${Date.now()}.mp3`, { type: 'audio/mpeg' })
        fileCallBack && fileCallBack(file, second)
        reset()
      }

      setMediaRecorder(recorder)
      setIsRecording(true)

      recorder.start()
    } catch (error) {
      console.error('Error initializing recorder:', error)
    }
  }

  /**
   * 停止录制
   */
  const stop = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      second = 0
      if (timer) clearInterval(timer)
    }
  }

  return {
    isRecording,
    start,
    stop,
    reset,
  }
}
