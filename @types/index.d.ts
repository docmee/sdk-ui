type EntryPage =
  | 'dashboard'
  | 'editor'
  | 'creator'
  | 'creator-v2'
  | 'customTemplate'
  | 'templateCreator'
  | 'templateMarker'

interface InitOptions {
  /**
   * 容器
   *  如果传入字符串，则表示这个容器元素的id
   *
   * @example 'id' | HTMLDivElement
   * @import
   */
  container: HTMLDivElement | string
  /** token*/
  token: string

  /** 进入的页面 */
  page: EntryPage

  /** 进入editor页面时必须传递pptId参数 */
  pptId?: string

  /**
   * 所有事件的回调都会执行
   */
  onMessage?: EventCallback

  /**
   * 进入editor页面时，是否显示制作动画
   */
  animation?: boolean

  mode?: 'light' | 'dark'
  lang?: string
}
