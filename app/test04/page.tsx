'use client'

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <Head>
        <title>心理テスト04</title>
        <meta name="description" content="心理テストのサンプル" />
      </Head>

      <main>
        <h1>心理テスト04</h1>
        <p>
          Hello
        </p>
        <hr style={{ margin: '30px' }} />
        <div style={{ fontSize: '16px', margin: '30px' }}>
          <Link href="/">
            トップページに戻る
          </Link>
        </div>
      </main>
    </div>
  );
}