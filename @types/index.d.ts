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

    /**
     * iframe 背景颜色，可填入颜色或者图片 url 地址
     *
     */
    background?: string;

    /**
     * iframe 背景大小 与 CSS 中的 background-size 语法相同
     */
    backgroundSize?: string | number;

    /**
     *  内边距（也就是 css 的 padding，语法相同）
     */
    padding?: string | number;

    /**
     * 下载文件选项 返回 false 表示禁用下载，如果只想打开一种下载方式，可以传递数组`['pptx']`表示只允许下载为 pptx 格式
     *
     * @example false
     * @example ['pdf']
     */
    downloadButton?: boolean | ("pptx" | "pdf")[];

    /**
     *  生成 PPT 方式，topic：主题生成，material：外部资料
     * 只在V1  中能使用
     *  @example "topic"
     */
    creatorMode?: "topic" | "material";

    /**
     * 适配移动端
     *
     * */
    isMobile?: boolean;

    creatorData?:
      | { subject?: string; text?: string; creatorNow?: boolean }
      | {
          files?: File[];
          content?: string;
          subject?: string;
          type?: CreatorType;
          options?: CreatorDataOptions;
        };

    /**
     * 编辑器显示区域
     *
     * 不传或者传空数组表示显示全部
     *
     * - `viewport` 主编辑视窗
     * - `slidesList` 左侧幻灯片列表
     * - `header` 顶部状态栏
     * - `statusBar` 底部状态栏
     * - `tools` 右侧工具栏
     */
    editorDisplay?: EditorDisplayKey[];
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

  type EditorDisplayKey = "viewport" | "slidesList" | "statusBar" | "tools" | "header";
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
