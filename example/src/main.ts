import { CreatorType, DocmeeUI } from "@docmee/sdk-ui";

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
    creatorData: { type: CreatorType.AI_GEN, subject: "AI未来十年的发展" },
    lang: "zh",
    creatorVersion: "v2",
    onMessage: console.log,
  });

  document.getElementById("toCreator").addEventListener("click", () => {
    docmee.navigate({ page: "creator-v2" });
  });
})();
