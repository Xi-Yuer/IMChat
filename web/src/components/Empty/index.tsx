import { memo } from 'react'

const Empty = memo(() => {
  return (
    <div className="w-full h-full  transition-all duration-700  flex justify-center text-[#666666] items-center flex-col dark:text-gray-200 font-sans font-bold leading-6 text-lg">
      <div className="transition-all duration-700">欢迎使用【IMChat鱼聊】</div>
      <div className="mt-10 transition-all duration-700 text-[#fcc04d] pt-3 border-t-8 dark:border-[#e5e7eb] border-[#666666]">&copy;Xi-Yuer</div>
    </div>
  )
})

export default Empty
