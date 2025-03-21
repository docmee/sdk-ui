declare global {
  type EntryPage =
    | "dashboard"
    | "editor"
    | "creator"
    | "creator-v2"
    | "customTemplate"
    | "templateCreator"
    | "templateMarker";

  interface InitOptions {
    /**
     * 容器
     *  如果传入字符串，则表示这个容器元素的id
     *
     * @example 'id' | HTMLDivElement
     * @import
     */
    container: HTMLDivElement | string;
    /** token*/
    token: string;

    /** 进入的页面 */
    page: EntryPage;

    /** 进入editor页面时必须传递pptId参数 */
    pptId?: string;

    /**
     * 所有事件的回调都会执行
     */
    onMessage?: EventCallback;

    /**
     * 进入editor页面时，是否显示制作动画
     */
    animation?: boolean;

    mode?: "light" | "dark";
    lang?: string;

    /** 创建PPT 版本, V1是步骤式，V2是对话式 */
    creatorVersion?: "v1" | "v2";

    /**
     * 注入 CSS 样式
     * 可通过传递自定义 CSS 来更加深度地自定义文多多的样式，支持可访问的 URL 地址或直接传入 CSS 字符串
     *
     * @example #docmee_SdkContainer {background: white !important;}
     * @example https://abc.cn/style.css
     * */
    css?: string;

    creatorData?:
      | { subject?: string; text?: string; creatorNow?: boolean }
      | {
          files?: File[];
          content?: string;
          subject?: string;
          type?: CreatorType;
          options?: CreatorDataOptions;
        };
  }

  interface CreatorDataOptions {
    /** 篇幅长度：short/medium/long => 10-15页/20-30页/25-35页 */
    length?: string;
    /** 演示场景：通用场景、教学课件、工作总结、工作计划、项目汇报、解决方案、研究报告、会议材料、产品介绍、公司介绍、商业计划书、科普宣传、公众演讲 等任意场景类型。 */
    scene?: string;
    /** 受众：大众、学生、老师、上级领导、下属、面试官、同事 等任意受众类型。 */
    audience?: string;
    /** 是否开启反问模式（对话模式） */
    questionMode?: boolean;
    /** 是否开启智能搜索 */
    aiSearch?: boolean;
    /** 语言: zh/zh-Hant/en/ja/ko/ar/de/fr/it/pt/es/ru */
    lang?: string;
    /** 用户要求（小于50字） */
    prompt?: string;
    /** **多轮对话**  助手反问聊天对话，反问过程中如需终止直接生成请设置 questionMode 为 false 调用接口*/
    messages?: GenerateContentContextMessage[];
  }

  interface GenerateContentContextMessage {
    role: "assistant" | "user";
    content: string;
  }
}

export enum CreatorType {
  /** 智能生成（主题、要求） */
  AI_GEN = 1,
  /** 上传文件 */
  UPLOAD_FILES = 2,
  /** 上传思维导图 */
  UPLOAD_MIND = 3,
  /** 通过word精准转ppt */
  WORD = 4,
  /** 通过网页链接生成 */
  URL = 5,
  /** 粘贴文本内容生成 */
  CONTENT = 6,
  /** Markdown大纲生成 */
  MD = 7,
}
