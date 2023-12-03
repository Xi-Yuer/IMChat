import classNames from 'classnames'

export const normalStyle = {
  Wrapper: 'backdrop-blur-3xl dark:bg-gray-600 transition-all duration-700',
  Inner: 'overflow-hidden bg-white rounded-lg flex select-none dark:bg-[#333643] transition-all duration-700',
}

export const PcStyle = {
  Wrapper: 'bg-gray-200 w-screen h-screen flex items-center justify-center',
  Inner: 'w-[80%] h-[80%] min-h-[500px] min-w-[600px]',
}

export const MobileStyle = {
  Wrapper: 'w-screen h-screen',
  Inner: 'w-screen h-screen',
}

export const WrapperStyle = (isMobile: boolean) =>
  classNames(normalStyle.Wrapper, {
    [PcStyle.Wrapper]: !isMobile,
    [MobileStyle.Wrapper]: isMobile,
  })
export const InnerStyle = (isMobile: boolean) =>
  classNames(normalStyle.Inner, {
    [PcStyle.Inner]: !isMobile,
    [MobileStyle.Inner]: isMobile,
  })
