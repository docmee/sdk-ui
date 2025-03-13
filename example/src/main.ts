import { DocmeeUI } from "@docmee/sdk-ui";

(async function main() {
  const res = await fetch("https:/docmee.cn/api/user/createApiToken", {
    method: "POST",
    body: JSON.stringify({
      uid: new Date().getTime() + "",
      limit: 1,
    }),
    headers: {
      "Api-Key": import.meta.env.VITE_APK_KEY,
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();

  const docmee = new DocmeeUI({
    container: "app",
    page: "creator-v2",
    token: json.data.token,
    mode: "light",
    lang: "zh",
  });

  docmee.on("mounted", (msg) => {
    console.log(msg);
  });

  docmee.on("beforeDownload", () => {
    return false; // 返回false 阻止下载
  });

  docmee.on("beforeGenerate", (msg) => {
    console.log(msg);
  });

  docmee.on("pageChange", (msg) => {
    console.log(msg);
  });

  docmee.on("error", (msg) => {
    console.log(msg);
  });

  docmee.on("changeSlideIndex", ({ data }) => {
    data.slideIndex;
  });
})();
