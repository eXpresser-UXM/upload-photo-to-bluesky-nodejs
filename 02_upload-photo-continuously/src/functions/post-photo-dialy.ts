import { app, InvocationContext, Timer } from "@azure/functions";
import postPhotoToBlueskyMain from "../lib/post-photo-to-bluesky";

export async function postPhotoDaily(myTimer: Timer, context: InvocationContext): Promise<void> {
  try {
    const myWebsiteHost = process.env["MyWebsite:Host"];
    const imagePath = process.env["MyWebsite:Image"];
    const photoTitle = process.env["MyWebsite:Title"];
    const bskyService = process.env["Bluesky:Service"];
    const bskyIdentifier = process.env["Bluesky:Identifier"];
    const bskyAppPassword = process.env["Bluesky:AppPassword"];

    if (!myWebsiteHost || !imagePath || !photoTitle || !bskyService || !bskyIdentifier || !bskyAppPassword) {
      throw new Error('Not enough environment variables. "MyWebsite:Host", "MyWebsite:Image", "MyWebsite:Title", "Bluesky:Service", "Bluesky:Identifier", "Bluesky:AppPassword" are required.');
    }

    await postPhotoToBlueskyMain(myWebsiteHost, imagePath, photoTitle, bskyService, bskyIdentifier, bskyAppPassword);

  } catch (e) {
    console.error(e);
  }
}

// 1日1回、19時に実行
app.timer('postPhotoDaily', {
  // 実行は世界標準時基準 (UTC) で行われます
  // See: https://learn.microsoft.com/ja-jp/azure/azure-functions/functions-bindings-timer?tabs=python-v2%2Cisolated-process%2Cnodejs-v4&pivots=programming-language-javascript#ncrontab-expressions
  schedule: '0 0 10 * * *',
  handler: postPhotoDaily
});
