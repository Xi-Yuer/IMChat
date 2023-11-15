import { RootState } from '@/store'
import {
  App,
  Button,
  Form,
  Input,
  Modal,
  Radio,
  Upload,
  UploadFile,
} from 'antd'
import { UploadChangeParam } from 'antd/es/upload'
import { UploadProps } from 'antd/lib'
import { RcFile } from 'antd/lib/upload'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeUserProfile, userLogOut } from '../../store/modules/user'
import { getBase64 } from '../../utils/getBase64'

export interface OpenModalProfilePanel {
  open: () => void
}
type FieldType = {
  account: string
  gender: string
  bio: string
}

const MinePanel = forwardRef<OpenModalProfilePanel>((_, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { message } = App.useApp()
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.UserReducer.user)
  const [userTemp, setUserTemp] = useState({})
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState<RcFile>()
  const handleOk = () => {}
  const logOut = () => {
    dispatch(userLogOut())
    setIsModalOpen(false)
  }
  const FormChange = (_: any, allValues: any) => {
    setUserTemp(allValues)
  }
  const modalCancel = () => {
    setIsModalOpen(false)
    dispatch(changeUserProfile({ ...user, ...userTemp }))
  }

  const uploadProps: UploadProps = {
    beforeUpload: (file: File) => {
      const isPNG = file.type === 'image/png' || file.type === 'image/jpeg'
      if (!isPNG) {
        message.error(`文件类型不正确`)
      }
      return isPNG || Upload.LIST_IGNORE
    },
    onChange: async (info: UploadChangeParam<UploadFile>) => {
      console.log(info)
      if (info.file.status === 'uploading') {
        return
      }
      if (info.file.status === 'done') {
        const url = await getBase64(info.file.originFileObj as RcFile)
        console.log(url)
      }
    },
    action: undefined,
    maxCount: 1,
    showUploadList: false,
  }

  useImperativeHandle(ref, () => ({
    open: () => setIsModalOpen(true),
  }))
  return (
    <>
      <Modal
        className="animate-fade-in-down select-none"
        open={isModalOpen}
        onOk={handleOk}
        width={350}
        onCancel={modalCancel}
        footer={[]}
      >
        <div className="flex flex-col items-center justify-center">
          <Upload {...uploadProps}>
            <img
              className="w-12 h-12 rounded-full"
              src={user.profile_picture}
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
            <Form.Item<FieldType> label="用户名" name="account">
              <Input placeholder="请输入用户名" bordered={false} />
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
            <Button onClick={logOut}>退出登录</Button>
          </div>
        </div>
      </Modal>
    </>
  )
})

export default MinePanel
