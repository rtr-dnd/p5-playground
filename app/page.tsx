import Image from 'next/image';

import CubeIcon from '@/public/cube.svg';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">app/page.tsx</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{' '}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>
      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>
      <CubeIcon className="mt-20 w-10 h-10 text-blue-500" />
      <div className="py-10">
        <h3>左揃え</h3>
        <p>
          木曾路はすべて山の中である。あるところは岨づたいに行く崖の道であり、あるところは数十間の深さに臨む木曾川の岸であり、あるところは山の尾をめぐる谷の入り口である。一筋の街道はこの深い森林地帯を貫いていた。
          東ざかいのCherry
          Blossom沢から、西の十曲峠まで、木曾十一宿はこの街道に添うて、22里余にわたる長い谿谷の間に散在していた。
          【道路の位置も幾たびか改まったもので、古道はいつのまにか深い山間に埋もれた。名高い桟も、蔦のかずらを頼みにしたような危い場処ではなくなって、徳川時代の末にはすでに渡ることのできる橋であった。】
          新規に新規にとできた道はだんだん谷の下の方の位置へと降って来た。
          道の狭いところには、木を伐って並べ、藤づるでからめ、それで街道の狭いのを補った。
          <span className="font-bold">
            長い間にこの木曾路に起こって来た変化は、いくらかずつでも嶮岨な山坂の多いところをEasier-to-walkにした。
          </span>
        </p>
      </div>
      <div className="py-10">
        <h3>両端揃え</h3>
        <p className="text-justify">
          木曾路はすべて山の中である。あるところは岨づたいに行く崖の道であり、あるところは数十間の深さに臨む木曾川の岸であり、あるところは山の尾をめぐる谷の入り口である。一筋の街道はこの深い森林地帯を貫いていた。
          東ざかいのCherry
          Blossom沢から、西の十曲峠まで、木曾十一宿はこの街道に添うて、22里余にわたる長い谿谷の間に散在していた。
          【道路の位置も幾たびか改まったもので、古道はいつのまにか深い山間に埋もれた。名高い桟も、蔦のかずらを頼みにしたような危い場処ではなくなって、徳川時代の末にはすでに渡ることのできる橋であった。】
          新規に新規にとできた道はだんだん谷の下の方の位置へと降って来た。
          道の狭いところには、木を伐って並べ、藤づるでからめ、それで街道の狭いのを補った。
          <span className="font-bold">
            長い間にこの木曾路に起こって来た変化は、いくらかずつでも嶮岨な山坂の多いところをEasier-to-walkにした。
          </span>
        </p>
      </div>
      <div className="py-10">
        <h3>Alignment: left</h3>
        <p>
          Kiso Road is entirely surrounded by mountains. In some places, it
          follows a cliffside path, in others, it runs along the banks of the
          Kiso River, which drops tens of meters below, and in some places, it
          winds around the entrances to valleys along mountain ridges. A single
          highway cuts through this dense forest region. From Sakurasawa in the
          east to Jumokutoge in the west, the eleven post stations of Kiso are
          scattered along this highway, spanning over twenty-two ri through the
          long valley. The road's position has changed several times, with the
          old paths gradually becoming buried deep in the mountains. The famous
          hanging bridge is no longer a perilous crossing relying on vines; by
          the end of the Tokugawa era, it had already become a bridge that could
          be crossed. The new roads gradually descended to the lower parts of
          the valleys. In narrow places, trees were cut and lined up, and the
          gaps were filled with wisteria vines to compensate for the narrowness
          of the highway.
          <br />
          <span className="font-bold">
            Over time, the changes that occurred along Kiso Road made it
            somewhat easier to traverse these steep mountain paths.
          </span>
        </p>
      </div>
      <div className="py-10">
        <h3>Alignment: justify</h3>
        <p className="text-justify">
          Kiso Road is entirely surrounded by mountains. In some places, it
          follows a cliffside path, in others, it runs along the banks of the
          Kiso River, which drops tens of meters below, and in some places, it
          winds around the entrances to valleys along mountain ridges. A single
          highway cuts through this dense forest region. From Sakurasawa in the
          east to Jumokutoge in the west, the eleven post stations of Kiso are
          scattered along this highway, spanning over twenty-two ri through the
          long valley. The road's position has changed several times, with the
          old paths gradually becoming buried deep in the mountains. The famous
          hanging bridge is no longer a perilous crossing relying on vines; by
          the end of the Tokugawa era, it had already become a bridge that could
          be crossed. The new roads gradually descended to the lower parts of
          the valleys. In narrow places, trees were cut and lined up, and the
          gaps were filled with wisteria vines to compensate for the narrowness
          of the highway.
          <br />
          <span className="font-bold">
            Over time, the changes that occurred along Kiso Road made it
            somewhat easier to traverse these steep mountain paths.
          </span>
        </p>
      </div>
      <div className="my-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Docs{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Learn{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Templates{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Explore starter templates for Next.js.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Deploy{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-balance text-sm opacity-50">
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  );
}
