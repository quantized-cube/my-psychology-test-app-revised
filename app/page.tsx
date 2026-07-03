import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: '心理テストまとめ',
  description: '心理テストのサンプル',
}

export default function Home() {
  return (
    <div>
      <main>
        <h1>心理テストまとめ</h1>
        <ul>
          <li>
            <Link href="/tipi-j">
              TIPI-J
            </Link>
          </li>
          <li>
            <Link href="/ysq-r">
              YSQ-R
            </Link>
          </li>
          <li>
            <Link href="/career-anchors">
              キャリア・アンカー
            </Link>
          </li>
          <li>
            <a href="/time-perspective">
              時間志向チェックテスト
            </a>
            <p style={{ fontSize: '0.8rem' }}>パスワード：10問目の最初5文字をアルファベット半角小文字</p>
          </li>
          <li>
            <a href="/tpi">
              時間志向テスト
            </a>
          </li>
          <li>
            <Link href="/paradox-mindset">
              パラドックス・マインドセット関連尺度
            </Link>
          </li>
          <li>
            <Link href="/attractiveness">
              魅力度テスト
            </Link>
          </li>
          <li>
            <Link href="/nature-connectedness">
              ネイチャー・コネクテッドネス診断
            </Link>
          </li>
          <li>
            <Link href="/nfc">
              NFCテスト
            </Link>
          </li>
        </ul>
      </main>
    </div>
  );
}