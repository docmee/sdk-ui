import { CreatorType, DocmeeUI } from '@docmee/sdk-ui'

const docmeeUI = new DocmeeUI({
  container: 'app',
  page: 'creator-v2',
  token: 'xxxx',
  mode: 'light',
  lang: 'zh',
  creatorData: {
    type: CreatorType.MD, // 传入大纲生成
    content: ``, // 大纲内容
  },
})
