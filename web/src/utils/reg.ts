// 匹配 @userName 将该部分的文字高亮
export function highlightUsername(text: string): string {
  const regex = /@(\S+)/g
  return text.replace(regex, '<span class="inline-block bg-gray-200 px-2 text-blue-400 rounded-md">@$1</span>')
}

// 将输入框的字符串通过正则，将符号替换成转义字符
export const escapeHTML = (str: string) =>
  str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
      })[tag] || tag
  )
