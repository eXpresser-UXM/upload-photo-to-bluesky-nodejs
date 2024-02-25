import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import postPhotoToBlueskyMain from "../lib/post-photo-to-bluesky";

export async function postPhotoImmediately(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

    return {
      status: 200,
      body: 'OK'
    };

  } catch (e) {
    if (e instanceof Error) {
      return {
        status: 500,
        body: e.message
      };
    } else {
      return {
        status: 500,
        body: 'Unknown Error.'
      };
    }
  }
}

// テスト用
// このAPIを叩くと自動的に投稿が行われますので、 Function デプロイの際は無効化することをお勧めします
app.http('postPhotoImmediately', {
  methods: ['GET', 'POST'],
  authLevel: 'function',
  handler: postPhotoImmediately
});


