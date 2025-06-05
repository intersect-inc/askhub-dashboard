export default function Home() {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-label-xl">フォントテスト - Pretendard JP</h1>
      <p className="mb-4 text-paragraph-sm">
        このテキストはPretendard JPフォントで表示されるはずです。
      </p>
      <p className="text-paragraph-sm text-gray-600">
        ブラウザの開発者ツールでfont-familyを確認してください。
      </p>

      {/* フォント確認用の情報 */}
      <div className="mt-8 rounded bg-gray-100 p-4">
        <h2 className="mb-2 font-medium">デバッグ情報:</h2>
        <ul className="space-y-1 text-paragraph-sm">
          <li>• 右上にCSS変数の値が表示されます</li>
          <li>• 開発者ツールでComputed Stylesを確認してください</li>
          <li>• Networkタブでフォントファイルの読み込みを確認してください</li>
        </ul>
      </div>
    </div>
  )
}
