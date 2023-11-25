import { DownloadOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import { FC, memo } from 'react'
import XlsxImage from '../../assets/image/format-xlsx.png'
import { IMessagePanelProps } from './DocxMessage'

const VoiceMessage: FC<IMessagePanelProps> = memo(({ content, file_name }) => {
  return (
    <div
      className={classNames(
        'w-[250px] overflow-hidden relative rounded-md h-[80px] p-2 box-content flex items-center bg-slate-100 dark:bg-green-400 transition-all duration-700'
      )}
      style={{
        backgroundImage: `url(${XlsxImage})`,
        backgroundSize: '16% 50%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '10%',
      }}
    >
      <div className="flex-1 transition-all duration-700 px-2 w-[100px] text-start truncate ml-[55px] dark:text-[#414141]">
        {file_name}
      </div>
      <a href={content} download rel="noopener" target="_blank">
        <DownloadOutlined className="mr-[50px] transition-all duration-700 dark:text-[#414141]" />
      </a>
    </div>
  )
})

export default VoiceMessage
