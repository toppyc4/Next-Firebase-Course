import Head from "next/head"

export default function Metatags({ title, description, image }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name='twiter:card' content='summary' />
      <meta name='twiter:site' content='@fireship_dev' />
      <meta name='twiter:title' content={title} />
      <meta name='twiter:description' content={description} />
      <meta name='twiter:image' content={image} />

      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={image} />
    </Head>
  )
}
