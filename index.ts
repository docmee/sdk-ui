import queryString from "query-string";
import { CreatorType } from "./@types/index.d";
import { docmeeContext, getIframeUrl, getPageKey, pageKeyHrefMap } from "./utils";

// const BASE_URL = 'https://docmee.cn'
// const BASE_URL = 'https://location:8125'

/**
 * Docmee UI SDK class
 */
export class DocmeeUI {
  private creatorVersion?: InitOptions["creatorVersion"];
  private token: string;
  private container: HTMLDivElement;
  private docmeeHref: string = getIframeUrl("dashboard");
  private query: Record<string, any> = { iframe: "1" };
  private iframe: HTMLIFrameElement | null = null;
  private onMessage: EventCallback;
  private iframeMounted: boolean = false;
  private initInterval = null;

  constructor({
    token,
    page = "dashboard",
    container,
    pptId,
    onMessage,
    // @ts-ignore
    DOMAIN,
    ...otherOptions
  }: InitOptions) {
    // 如果在初始化的过程中传递token了，就是option模式创建docmee实例
    // 如果没有传递token，就是async模式创建docmee实例

    // option模式就是简单的同步模式，初始化docmee时，iframe就会创建
    // async模式就不一样，初始化docmee时，iframe不会被立即创建，在调用 init 方法时，iframe才会创建出来。
    this.onMessage = onMessage;
    this.creatorVersion = otherOptions.creatorVersion;
    if (typeof container == "string") {
      this.container = document.getElementById(container) as HTMLDivElement;
    } else {
      this.container = container;
    }

    if (location.protocol.startsWith("file")) {
      console.log(
        "%c %s",
        "color: red; background-color: #f7c600",
        "🔴 不能在file协议下运行，请启动一个http服务来运行！ 🔴 "
      );
    }

    if (!token) {
      console.log("%c 初始化时，token不能为空！", "color: #d7514f; background-color: #2e2e2e");
    }

    if (DOMAIN) {
      docmeeContext.BASE_URL = DOMAIN;
    }
    this.init({ token, page, pptId, ...otherOptions });
  }

  public on(eventName: UIEventName, callback: EventCallback) {
    this._eventListeners[eventName] = [...(this._eventListeners[eventName] || []), callback];
  }

  private _eventListeners: Record<UIEventName, EventCallback[]> = {
    mounted: [],
    beforeGenerate: [],
    beforeCreateCustomTemplate: [],
    "user-info": [],
    charge: [],
    afterCreateCustomTemplate: [],
    afterGenerate: [],
    beforeDownload: [],
    error: [],
    manuallySavePPT: [],
    toggleGenerateMode: [],
    pageChange: [],
    changeSlideIndex: [],
    "invalid-token": [],
    beforeCreatePpt: [],
  };

  private _postMessage(message) {
    if (!this.iframe?.contentWindow) {
      console.log(this.iframe?.contentWindow);
      console.error("iframe未挂载！");
    }
    this.iframe?.contentWindow?.postMessage(message, this.docmeeHref);
  }

  private init({ token, page = "dashboard", ...otherOptions }) {
    if (page === "editor" && !otherOptions.pptId) throw new Error("初始化editor页面时，必须传入pptId");

    this.query = Object.assign({}, this.query, otherOptions);
    this.docmeeHref = getIframeUrl(page, otherOptions.creatorVersion);
    this.updateToken(token);
    this._initIframe(true);
  }

  // 初始化iframe
  private _initIframe(parseTokenByMessage) {
    const container = this.container;
    const iframe = document.createElement("iframe");
    const targetOrigin = `${location.protocol}//${location.host}`;
    const iframeSource = queryString.stringifyUrl({
      url: this.docmeeHref,
      query: parseTokenByMessage ? { iframe: 1, targetOrigin } : this.query,
    });
    iframe.src = iframeSource;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "0";
    iframe.style.outline = "none";
    iframe.style.padding = "0px";
    iframe.setAttribute("allow", `fullscreen *;clipboard-read; clipboard-write;payment; cross-origin-isolated`);

    this.iframe = iframe;
    this.iframeMounted = false;
    // 清空iframe中的内容并挂载iframe
    container.innerHTML = "";
    container.appendChild(iframe);

    window.addEventListener("message", async (event) => {
      if (event.source !== this.iframe?.contentWindow) return;
      const message = event.data as { type: UIEventName; data: any };
      if (!message.type) return;
      if (parseTokenByMessage) {
        if (message.type === "mounted" || message.type === "invalid-token") {
          this.iframeMounted = true;
          if (message.type === "mounted") {
            this._postMessage({
              type: "transParams",
              data: this.query,
            });
          }
        }
      }
      if (message.type === "user-info") {
        this.iframeMounted = true;
      }

      let res;
      res = await this.onMessage?.(message);
      const onCallbacks = this._eventListeners[message.type];
      if (onCallbacks?.length > 0) {
         for (const callback of onCallbacks) {  
            try {
             let result = callback?.(message);  
             if (result instanceof Promise) {
                result = await result;  
              }
              if (result !== undefined) {
               res = result;  
             }
            }catch {}
        };
      }

      if (message.type.startsWith("before")) {
        if (res == undefined) res = true;
        this._postMessage({ data: res, type: `recover_${message.type}` });
      }
    });

    this.iframe.addEventListener("load", () => {
      let infoAPiCount = 0;
      setTimeout(() => {
        if (this.iframeMounted) return;
        this.initInterval = setInterval(() => {
          if (this.iframeMounted || infoAPiCount >= 5) {
            infoAPiCount = 0;
            return clearInterval(this.initInterval);
          }
          if (parseTokenByMessage) {
            this._postMessage({
              type: "transParams",
              data: this.query,
            });
          }
          infoAPiCount++;
        }, 200);
      }, 300);
    });
  }

  /**
   * 在编辑页面跳转到对应的幻灯片
   *
   * @param targetPageIndex 跳转的幻灯片下标
   */
  public updateSlidePageIndex(targetPageIndex: number) {
    this._postMessage({ type: "changeSlidePageIndex", data: { pageIndex: targetPageIndex } });
  }

  /**
   * 更新用户token
   * @param {string} latestToken 新的token
   */
  public updateToken(latestToken: string) {
    const regex = /(a|s)k_.+/;
    if (!regex.test(latestToken)) {
      console.error("token 错误！");
    }
    this.token = latestToken;
    this.query.token = latestToken;
    if (this.iframeMounted) {
      this._postMessage({
        type: "transParams",
        data: {
          token: latestToken,
        },
      });
    }
  }

  /**
   * 卸载iframe
   */
  public destroy() {
    this.container.innerHTML = "";
  }

  /**
   * 发送消息
   */
  public sendMessage(data: { type: "warning" | "success" | "error" | "info"; content: string }) {
    this._postMessage({ type: "message", data });
  }

  public getInfo() {
    this._postMessage({ type: "getInfo" });
  }

  /**
   * 跳转到指定页面
   *
   */
  public navigate({ page, pptId, templateId }: { page: string; pptId?: string; templateId?: string }) {
    const href = pageKeyHrefMap[page];

    if (!href) throw new Error(`页面${page} 不存在`);
    const key = getPageKey(page, this.creatorVersion);

    this._postMessage({
      type: "nav",
      data: {
        page: key,
        token: this.token,
        pptId,
        templateId,
      },
    });
  }

  /**
   * 继续生成PPT，仅在V2中可用
   */
  public continueCreatePpt() {
    this._postMessage({ type: "continueCreatePpt" });
  }

  /**
   * 修改用于 生成PPT的内容
   * @param data: any
   * @param now
   */
  public changeCreatorData(data, now = false) {
    this._postMessage({
      type: "transParams",
      data: { creatorData: { ...data, createNow: now } },
    });
  }

  /**
   * 修改当前编辑中的PPT的模版
   *
   * 该方法只在编辑页面生效
   * @param templateId  模版ID
   */
  public updateTemplate(templateId: string) {
    this._postMessage({
      type: "changeTemplateById",
      data: { templateId },
    });
  }

  /**
   * 打开模版选择弹窗
   *
   * 该方法只在编辑页面生效
   */
  public showTemplateDialog(type = "system") {
    this._postMessage({
      type: "showTemplateDialog",
      data: { type },
    });
  }

  /**
   * 获取当前编辑中的PPT的信息，PPT数据将在回调中返回
   *
   * 该方法只在编辑页面生效
   */
  public getCurrentPptInfo() {
    this._postMessage({
      type: "getCurrentPptInfo",
    });
  }

  /**
   * 导入外部CSS文件
   *
   * @param css css样式，可以传递标准的css规则字符串，也可以使用能够访问的url
   */
  public importCSS(css: string) {
    this._postMessage({ type: "importCSS", data: { css } });
  }
}

// @ts-ignore
window.DocmeeUI = DocmeeUI;

export { CreatorType };
