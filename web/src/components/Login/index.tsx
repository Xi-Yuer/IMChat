import { SwapOutlined } from '@ant-design/icons'
import { Avatar, Button, Form, Input, Modal, Popover, Tooltip } from 'antd'
import { forwardRef, memo, useImperativeHandle, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Md5 } from 'ts-md5'
import {
  ILoginResponse,
  loginRequest,
  registerRequest,
} from '../../server/apis/user'
import { userLogin } from '../../store/modules/user'

export interface OpenModal {
  open: () => void
}
const Loggin = forwardRef<OpenModal>((_, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRegister, setisRegister] = useState(false)
  const dispatch = useDispatch()
  const handleOk = () => {}
  const handleCancel = () => setIsModalOpen(false)

  type FieldType = {
    account: string
    password: string
  }
  const switchMethod = () => setisRegister(!isRegister)
  const onFinish = (value: FieldType) => {
    const fn = isRegister ? registerRequest : loginRequest
    if (!isRegister) {
      value.password = Md5.hashAsciiStr(value.password)
    }
    fn(value).then((res) => {
      if (isRegister) {
        // 注册成功
        setisRegister(false)
      } else {
        // 登录成功
        setIsModalOpen(false)
        if (res.data) {
          dispatch(userLogin(res.data as ILoginResponse))
        }
      }
    })
  }

  const avatarList = () => {
    return (
      <div className='flex gap-2'>
        <Avatar
          size={50}
          src={<img src={''} alt="avatar" />}
          className=" border border-gray-200 cursor-pointer"
        />
        <Avatar
          size={50}
          src={<img src={''} alt="avatar" />}
          className=" border border-gray-200 cursor-pointer"
        />
        <Avatar
          size={50}
          src={<img src={''} alt="avatar" />}
          className=" border border-gray-200 cursor-pointer"
        />
        <Avatar
          size={50}
          src={<img src={''} alt="avatar" />}
          className=" border border-gray-200 cursor-pointer"
        />
        <Avatar
          size={50}
          src={<img src={''} alt="avatar" />}
          className=" border border-gray-200 cursor-pointer"
        />
      </div>
    )
  }

  useImperativeHandle(ref, () => ({
    open: () => setIsModalOpen(true),
  }))

  return (
    <>
      <Modal
        className=" animate-fade-in-down"
        open={isModalOpen}
        onOk={handleOk}
        width={350}
        onCancel={handleCancel}
        footer={[]}
      >
        <h1 className=" text-center my-2 font-bold text-2xl">
          {isRegister ? '注册' : '登录'}
        </h1>
        <Popover
          trigger="click"
          placement="bottom"
          content={avatarList()}
          arrow={{ pointAtCenter: true }}
        >
          <div className="flex justify-center items-center h-[70px]">
            <Avatar
              size={50}
              src={<img src={''} alt="avatar" />}
              className=" border border-gray-200 cursor-pointer"
            />
          </div>
        </Popover>

        <Form
          name="login"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
          layout="horizontal"
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="账号"
            name="account"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="dashed" ghost htmlType="submit">
              {isRegister ? '立即注册' : '立即登录'}
            </Button>
          </Form.Item>
          <div
            className=" text-center mt-[-15px] cursor-pointer hover:text-blue-500 transition-all"
            onClick={switchMethod}
          >
            <Tooltip
              title={isRegister ? '切换登录' : '切换注册'}
              placement="bottom"
            >
              <SwapOutlined />
            </Tooltip>
          </div>
        </Form>
      </Modal>
    </>
  )
})

export default memo(Loggin)
