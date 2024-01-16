// 匹配 @userName 将该部分的文字高亮
export function highlightUsername(text: string): string {
  const regex = /@(\S+)/g
  return text.replace(regex, '<span class="inline-block bg-gray-200 w-fit px-2 mr-1 text-blue-400 rounded-md">@$1</span>')
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

// 解析字符串中的所有 url，可能包含多个 url
export const parseUrls = (text: string): string[] => {
  const urlRegex = /((http|https):\/\/)?(www\.)?([\w_-]+(?:\.[\w_-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g
  const urls = []

  let match
  while ((match = urlRegex.exec(text)) !== null) {
    // match[0] 匹配到整个 URL
    urls.push(match[0])
  }

  return urls
}
