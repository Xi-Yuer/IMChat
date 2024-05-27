import { RootState } from '@/store'
import { memo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Md5 } from 'ts-md5'
import { useParams, useSearchParams } from 'react-router-dom'
import CurrentRoom from '../../components/CurrentRoom/index'
import Empty from '../../components/Empty'
import Profile from '../../components/Profile'
import RoomList from '../../components/RoomList/index'
import { useScreen } from '../../hooks/useScreen'
import { InnerStyle, WrapperStyle } from './style'
import { getUserChatRoom } from '../../server/apis/chatRoom'
import { loginRequest, IRegisterParmas, ILoginResponse } from '../../server/apis/user'
import { changeRoomList, userLogin } from '../../store/modules/user'
import { changeRoomListLoading } from '../../store/modules/ui'

const Home = memo(() => {
  const { currentChatRoom } = useSelector((state: RootState) => state.ChatRoomReducer)
  const { isMobile } = useScreen()
  
  const [ searchParams ] = useSearchParams()
  const params = useParams()
  console.log('params',params);
  
  const account = searchParams.get('account') || ''
  const password = Md5.hashStr(searchParams.get('password') || '')
  const dispatch = useDispatch()
  useEffect(() => {
    if (!account || !password) return
    loginRequest({ account: account, password: password } as IRegisterParmas).then((res: any) => {
      if (res.data) {
        dispatch(userLogin(res.data as ILoginResponse))
        dispatch(changeRoomListLoading(true))
        getUserChatRoom()
          .then((res: any) => {
            dispatch(changeRoomList(res.data))
          })
          .finally(() => {
            dispatch(changeRoomListLoading(false))
          })
      }
    })
  },[account, password])
  return (
    <div className={WrapperStyle(isMobile)}>
      <div className={InnerStyle(isMobile)}>
        <Profile />
        <RoomList />
        {currentChatRoom?.id ? <CurrentRoom /> : <Empty />}
      </div>
      {!isMobile && (
        <div className=" absolute bottom-[20px] dark:text-gray-200 w-full flex justify-center">
          <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">
            备案号： 蜀ICP备2022015920号-1
          </a>
        </div>
      )}
    </div>
  )
})

export default Home
