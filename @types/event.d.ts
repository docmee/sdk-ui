type UIEventName =
  | "beforeCreatePpt"
  | "invalid-token"
  | "mounted"
  | "beforeGenerate"
  | "beforeCreateCustomTemplate"
  | "afterCreateCustomTemplate"
  | "charge"
  | "afterGenerate"
  | "beforeDownload"
  | "user-info"
  | "manuallySavePPT"
  | "error"
  | "toggleGenerateMode"
  | "pageChange"
  | "changeSlideIndex";

type EventMessage = {
  type: UIEventName;
  data: any;
};

type EventCallback = (eventMessage: EventMessage) => void | Promise<boolean> | boolean;
