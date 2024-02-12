import { BskyAgent, RichText } from "@atproto/api";
import axios from "axios";

// TODO: 投稿したい画像の取得元を定義する
const MY_WEBSITE: string = '<自分のWebサイト 例: https://example.com>';
const IMAGE_PATH: string = '<取得したい画像のパス 例: /photos/001.jpg>';
const PHOTO_TITLE: string = '<写真のタイトル>';

// TODO: 投稿先の Bluesky アカウントを設定する
const BSKY_SERVICE = 'https://bsky.social';
const BSKY_IDENTIFIER = '<Bluesky ID 例: myaccount.bsky.social>';
const BSKY_APP_PASSWORD = '<Bluesky アプリパスワード>';

/**
 * 自分のWebサイトから画像を取得する
 * @param myWebsite 自分のWebサイトのホスト名
 * @param imagePath 画像のパス
 * @returns 取得した画像の Blob オブジェクト
 */
async function getPhoto(myWebsite: string, imagePath: string): Promise<Blob> {
  // 自分のWebサイトから画像を取得する
  const photoData = await axios.get<Buffer>(
    `${MY_WEBSITE}${IMAGE_PATH}`,
    {
      responseType: "arraybuffer"
    }
  );
  // 画像の Content-Type を使用して、Blob型オブジェクトに変換する
  // content-type レスポンスヘッダには、'image/jpeg' 等の MIME タイプが含まれる想定
  return new Blob(
    [photoData.data], 
    { 
      type: photoData.headers["content-type"] 
    }
  );
}

/**
 * Bluesky に画像を投稿する
 * @param photoTitle 写真のタイトル
 * @param photoData getPhoto() で取得した画像の Blob オブジェクト
 * @param photoUrl 写真へのリンクURL
 * @param bskyService Bluesky インスタンスのURL
 * @param bskyIdentifier Bluesky ID
 * @param bskyAppPassword Bluesky アプリパスワード
 */
async function postPhotoToBluesky(photoTitle: string, photoData: Blob, photoUrl: string, bskyService: string, bskyIdentifier: string, bskyAppPassword: string): Promise<void> {
  const agent = new BskyAgent({
    service: bskyService
  });

  // アプリパスワードを使用して Bluesky にログインする
  await agent.login({
    identifier: bskyIdentifier,
    password: bskyAppPassword
  });

  // 画像をアップロードする
  // Blob型オブジェクトを Uint8Array に変換
  const dataArray: Uint8Array = new Uint8Array(await photoData.arrayBuffer());
  const { data: result } = await agent.uploadBlob(
    dataArray,
    {
      // 画像の形式を指定 ('image/jpeg' 等の MIME タイプ)
      encoding: photoData.type,
    }
  );

  // 投稿文の作成
  const text = `「${photoTitle}」
${photoUrl}`

  // テキストをメンション、リンク、絵文字を含むリッチテキストに変換
  const rt = new RichText({
    text: text
  })
  await rt.detectFacets(agent) // メンションやリンクを自動で検出する

  // 投稿を作成
  await agent.post({
    text: rt.text,
    facets: rt.facets,
    embed: {
      $type: 'app.bsky.embed.images',
      images: [
        {
          alt: photoTitle,
          image: result.blob, // 画像投稿時にレスポンスをここで渡すことにより、投稿と画像を紐付け
          aspectRatio: {
            // 画像のアスペクト比を指定 (指定しないと真っ黒になるので注意)
            width: 3,
            height: 2
          }
        }
        // images は4つまで指定可能
      ]
    },
    langs: ["ja-JP", "en-US"],
    createdAt: new Date().toISOString(), // 投稿日時を指定する
  });
}

// メイン処理
(async function () {
  try {
    const photo = await getPhoto(MY_WEBSITE, IMAGE_PATH);
    await postPhotoToBluesky(
      PHOTO_TITLE, photo, `${MY_WEBSITE}${IMAGE_PATH}`, 
      BSKY_SERVICE, BSKY_IDENTIFIER, BSKY_APP_PASSWORD
    );
  } catch (error) {
    console.log(error); 
  }
})();
