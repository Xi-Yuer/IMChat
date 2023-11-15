import request from '../request'

export const uploadFile = (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return request.post({
        url: '/file/upload',
        data: formData
    })
}