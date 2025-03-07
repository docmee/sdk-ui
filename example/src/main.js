import { DocmeeUI } from '@docmee/sdk-ui'

const docmee = new DocmeeUI({
  container: 'app',
  page: 'creator-v2',
  token: 'xxxxx',
  mode: 'light',
  lang: 'zh',
})

docmee.on('mounted', (msg) => {
  console.log(msg)
})

docmee.on('beforeGenerate', (msg) => {
  console.log(msg)
})

docmee.on('pageChange', (msg) => {
  console.log(msg)
})
