type UIEventName =
  | 'invalid-token'
  | 'mounted'
  | 'beforeGenerate'
  | 'beforeCreateCustomTemplate'
  | 'afterCreateCustomTemplate'
  | 'charge'
  | 'afterGenerate'
  | 'beforeDownload'
  | 'user-info'
  | 'manuallySavePPT'
  | 'error'
  | 'toggleGenerateMode'
  | 'pageChange'
  | 'slideChange'

type EventMessage = {
  type: UIEventName
  data: any
}

type EventCallback = (
  eventMessage: EventMessage,
) => void | Promise<boolean> | boolean
