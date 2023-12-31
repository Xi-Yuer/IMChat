import { SwapOutlined } from '@ant-design/icons'
import { Avatar, Button, Form, Input, Modal, Popover, Tooltip } from 'antd'
import { forwardRef, memo, useImperativeHandle, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Md5 } from 'ts-md5'
import { getUserChatRoom } from '../../server/apis/chatRoom'
import { ILoginResponse, loginRequest, registerRequest } from '../../server/apis/user'
import { changeRoomListLoading } from '../../store/modules/ui'
import { changeRoomList, userLogin } from '../../store/modules/user'
import { avatarImgList } from './constant'

export interface OpenModal {
  open: () => void
}
const Loggin = forwardRef<OpenModal>((_, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRegister, setisRegister] = useState(false)
  const [currentAvatar, setCurrentAvatar] = useState(0)
  const [loginLoading, setLoginLoading] = useState(false)
  const dispatch = useDispatch()
  const handleOk = () => {}

  type FieldType = {
    account: string
    nick_name: string
    password: string
  }
  const switchMethod = () => setisRegister(!isRegister)
  const onFinish = (value: FieldType) => {
    setLoginLoading(true)
    value.password = Md5.hashStr(value.password)
    // 注册
    if (isRegister) {
      registerRequest({ ...value, avatar_id: currentAvatar })
        .then(() => {
          setisRegister(false)
        })
        .finally(() => setLoginLoading(false))
    }
    // 登录
    if (!isRegister) {
      loginRequest(value)
        .then((res) => {
          setIsModalOpen(false)
          if (res.data) {
            dispatch(userLogin(res.data as ILoginResponse))
            dispatch(changeRoomListLoading(true))
            getUserChatRoom()
              .then((res) => {
                dispatch(changeRoomList(res.data))
              })
              .finally(() => {
                dispatch(changeRoomListLoading(false))
              })
          }
        })
        .finally(() => setLoginLoading(false))
    }
  }

  const avatarList = () => {
    return (
      <div className=" flex-nowrap flex gap-2 py-2 overflow-x-scroll w-[300px] select-none">
        {avatarImgList.map((img, index) => {
          return (
            <div onClick={() => setCurrentAvatar(index)} key={img}>
              <Avatar size={50} src={<img src={img} alt="avatar" />} className="border border-gray-200 cursor-pointer w-[180px] h-[80px] flex-1" />
            </div>
          )
        })}
      </div>
    )
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
        onCancel={() => setIsModalOpen(false)}
        footer={[]}
        destroyOnClose={true}
      >
        <div className="transition-all duration-700">
          <h1 className=" text-center my-2 font-bold text-2xl">{isRegister ? '注册' : '登录'}</h1>
          {isRegister && (
            <div className="flex justify-center items-center h-[70px]">
              <Popover trigger="click" placement="bottom" content={avatarList()} arrow={{ pointAtCenter: true }}>
                <div className="relative rounded-full overflow-hidden group">
                  <Avatar
                    size={50}
                    src={<img src={avatarImgList[currentAvatar]} alt="avatar" />}
                    className=" border border-gray-200 cursor-pointer"
                  />
                  <SwapOutlined className="hidden cursor-pointer absolute bottom-[-20px] left-0 text-sm text-center bg-black bg-opacity-50 w-full h-[40px] text-gray-100 group-hover:block" />
                </div>
              </Popover>
            </div>
          )}
          <Form
            name="login"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 18 }}
            layout="horizontal"
            style={{ maxWidth: 600 }}
            onFinish={onFinish}
            autoComplete="off"
          >
            {isRegister && (
              <Form.Item<FieldType> label="昵称" name="nick_name" rules={[{ required: true, message: '请输入昵称!' }]}>
                <Input />
              </Form.Item>
            )}
            <Form.Item<FieldType> label="账号" name="account" rules={[{ required: true, message: '请输入账号!' }]}>
              <Input />
            </Form.Item>
            <Form.Item<FieldType> label="密码" name="password" rules={[{ required: true, message: '请输入密码!' }]}>
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="dashed" htmlType="submit" loading={loginLoading}>
                {isRegister ? '立即注册' : '立即登录'}
              </Button>
            </Form.Item>
            <div className=" text-center mt-[-15px] hover:text-blue-500 transition-all" onClick={switchMethod}>
              <Tooltip title={isRegister ? '切换登录' : '切换注册'} placement="bottom">
                <SwapOutlined className="cursor-pointer" />
              </Tooltip>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  )
})

export default memo(Loggin)
