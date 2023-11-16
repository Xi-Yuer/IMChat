import { RootState } from '@/store'
import { App, Button, Form, Input, Modal, Radio, Upload } from 'antd'
import { UploadProps } from 'antd/lib'
import { RcFile } from 'antd/lib/upload'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uploadFile } from '../../server/apis/upload'
import { logout, updateUserRequest } from '../../server/apis/user'
import { changeUserProfile, userLogOut } from '../../store/modules/user'
import { getBase64 } from '../../utils/getBase64'

export interface OpenModalProfilePanel {
  open: () => void
}
type FieldType = {
  nick_name: string
  gender: string
  bio: string
}

const MinePanel = forwardRef<OpenModalProfilePanel>((_, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { message } = App.useApp()
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.UserReducer.user)
  const [userTemp, setUserTemp] = useState<any>(undefined)
  const [previewImage, setPreviewImage] = useState('')
  const [spinning, setSpinning] = useState(false)
  const [file, setFile] = useState<File>()

  const logOut = () => {
    setSpinning(true)
    logout()
      .then(() => {
        dispatch(userLogOut())
        setIsModalOpen(false)
      })
      .finally(() => {
        setSpinning(false)
      })
  }
  const FormChange = (_: any, allValues: any) => {
    setUserTemp(allValues)
  }
  const modalCancel = async () => {
    await updateUserInfo()
    setIsModalOpen(false)
  }

  const uploadProps: UploadProps = {
    beforeUpload: async (file: File) => {
      const isPNG = file.type === 'image/png' || file.type === 'image/jpeg'
      if (!isPNG) {
        message.error(`文件类型不正确`)
      }
      const url = await getBase64(file as RcFile)
      setPreviewImage(url)
      setFile(file)

      return false
    },
    action: undefined,
    maxCount: 1,
    showUploadList: false,
  }

  const updateUserInfo = async () => {
    try {
      if (file || userTemp != undefined) {
        setSpinning(true)
        if (file) {
          const {
            data: { file_url },
          } = await uploadFile(file)
          const { data } = await updateUserRequest({
            ...userTemp,
            profile_picture: file_url,
          })
          dispatch(changeUserProfile({ ...user, ...data }))
        } else {
          const { data } = await updateUserRequest(userTemp)
          dispatch(changeUserProfile({ ...user, ...data }))
        }
      }
    } catch (error) {
    } finally {
      setSpinning(false)
    }
  }

  useImperativeHandle(ref, () => ({
    open: () => {
      setUserTemp(undefined)
      setPreviewImage('')
      setFile(undefined)
      setIsModalOpen(true)
    },
  }))
  return (
    <>
      <Modal
        className="animate-fade-in-down select-none"
        open={isModalOpen}
        width={350}
        onCancel={modalCancel}
        footer={null}
      >
        <div className="flex flex-col items-center justify-center">
          <Upload {...uploadProps}>
            <img
              className="w-12 h-12 rounded-full"
              src={previewImage || user.profile_picture}
              alt="avatar"
            />
          </Upload>
          <Form
            layout="horizontal"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 14 }}
            className="mt-4"
            initialValues={user}
            onValuesChange={FormChange}
          >
            <Form.Item<FieldType> label="昵称" name="nick_name">
              <Input placeholder="请输入昵称" bordered={false} />
            </Form.Item>
            <Form.Item<FieldType> label="性别" name="gender">
              <Radio.Group value={user.gender} className="ml-2">
                <Radio value={'1'}>男</Radio>
                <Radio value={'0'}>女</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="个性签名" name="bio">
              <Input placeholder="请输入个性签名" bordered={false} />
            </Form.Item>
          </Form>
          <div className="mt-4">
            <Button onClick={logOut} loading={spinning}>
              {(file || userTemp != undefined) && spinning
                ? '更新资料...'
                : '退出登录'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
})

export default MinePanel
