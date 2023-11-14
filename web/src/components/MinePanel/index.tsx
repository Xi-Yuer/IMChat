import { RootState } from '@/store'
import { Button, Form, Input, Modal, Radio } from 'antd'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeUserProfile, userLogOut } from '../../store/modules/user'

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
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.UserReducer.user)
  const [userTemp, setUserTemp] = useState({})
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
          <img
            className="w-12 h-12 rounded-full"
            src={user.profile_picture}
            alt="avatar"
          />
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
