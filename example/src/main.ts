import { CreatorType, DocmeeUI } from "../../dist/index";

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
    page: "creator",
    creatorData: {
      text: "",
      creatorNow: true,
      type: CreatorType.AI_GEN,
    },
    token: json.data.token,
    mode: "light",
    lang: "zh",
    creatorVersion: "v2",
    // onMessage: console.log,
  });

  docmee.on("error", console.log);
  docmee.on("invalid-token", console.log);
  docmee.on("beforeCreatePpt", (msg) => {
    console.log(msg);
    // return false;
  });
})();
