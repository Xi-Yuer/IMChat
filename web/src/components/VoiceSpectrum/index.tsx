import classNames from 'classnames'
import { memo } from 'react'
import style from './style.module.css'
const VoiceSpectrum = () => {
  return (
    <div className="flex items-center justify-center">
      <div
        className={classNames('bg-gray-500  dark:bg-gray-200 transition-all duration-700 w-[3px] mr-[6px]', style.dounce_h, style.delay_100ms)}
      ></div>
      <div
        className={classNames('bg-gray-500 dark:bg-gray-200 transition-all duration-700 w-[3px] mr-[6px]', style.dounce_h, style.delay_200ms)}
      ></div>
      <div
        className={classNames('bg-gray-500 dark:bg-gray-200 transition-all duration-700 w-[3px] mr-[6px]', style.dounce_h, style.delay_300ms)}
      ></div>
      <div
        className={classNames('bg-gray-500 dark:bg-gray-200 transition-all duration-700 w-[3px] mr-[6px]', style.dounce_h, style.delay_400ms)}
      ></div>
      <div
        className={classNames('bg-gray-500 dark:bg-gray-200 transition-all duration-700 w-[3px] mr-[6px]', style.dounce_h, style.delay_500ms)}
      ></div>
      <div
        className={classNames('bg-gray-500 dark:bg-gray-200 transition-all duration-700 w-[3px] mr-[6px]', style.dounce_h, style.delay_600ms)}
      ></div>
      <div
        className={classNames('bg-gray-500 dark:bg-gray-200 transition-all duration-700 w-[3px] mr-[6px]', style.dounce_h, style.delay_700ms)}
      ></div>
      <div
        className={classNames('bg-gray-500 dark:bg-gray-200 transition-all duration-700 w-[3px] mr-[6px]', style.dounce_h, style.delay_800ms)}
      ></div>
      <div
        className={classNames('bg-gray-500 dark:bg-gray-200 transition-all duration-700 w-[3px] mr-[6px]', style.dounce_h, style.delay_900ms)}
      ></div>
      <div
        className={classNames('bg-gray-500 dark:bg-gray-200 transition-all duration-700 w-[3px] mr-[6px]', style.dounce_h, style.delay_1000ms)}
      ></div>
      <div
        className={classNames('bg-gray-500 dark:bg-gray-200 transition-all duration-700 w-[3px] mr-[6px]', style.dounce_h, style.delay_1100ms)}
      ></div>
      <div
        className={classNames('bg-gray-500 dark:bg-gray-200 transition-all duration-700 w-[3px] mr-[6px]', style.dounce_h, style.delay_1200ms)}
      ></div>
    </div>
  )
}

export default memo(VoiceSpectrum)
