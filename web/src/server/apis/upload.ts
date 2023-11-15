import { RcFile } from 'antd/es/upload'
import request from '../request'

export const uploadFile = (file: RcFile) => {
    const formData = new FormData()
    formData.append('file', file)
    return request.post({
        url: '/file/upload',
        data: formData
    })
}