import { PortableText } from '@portabletext/react';
import { useLoaderData } from 'react-router';
import { client } from '../client';

const QUERY = `*[_type == "aboutPage"][0]{
  title,
  "photoUrl": photo.asset->url,
  body[]{
    ...,
    _type == "image" => {
      ...,
      "url": asset->url
    }
  }
}`;

export async function loader() {
  const data = await client.fetch(QUERY);
  return { data: data || null };
}

const portableTextComponents = {
  marks: {
    externalLink: function ExternalLinkMark(props) {
      const url = props.value && props.value.href;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-black transition-colors"
        >
          {props.children}
        </a>
      );
    },
    link: function LinkMark(props) {
      const url = props.value && props.value.href;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-black transition-colors"
        >
          {props.children}
        </a>
      );
    },
  },
  list: {
    bullet: function BulletList(props) {
      return (
        <ul className="list-disc list-outside ml-5 mb-4 space-y-1">
          {props.children}
        </ul>
      );
    },
    number: function NumberList(props) {
      return (
        <ol className="list-decimal list-outside ml-5 mb-4 space-y-1">
          {props.children}
        </ol>
      );
    },
  },
  listItem: {
    bullet: function BulletItem(props) {
      return <li className="leading-relaxed">{props.children}</li>;
    },
    number: function NumberItem(props) {
      return <li className="leading-relaxed">{props.children}</li>;
    },
  },
  types: {
    image: function InlineImage(props) {
      if (!props.value || !props.value.url) return null;
      return (
        <figure className="my-6">
          <img
            src={props.value.url}
            alt={props.value.alt || ''}
            className="w-full md:w-2/3 object-cover"
          />
          {props.value.caption ? (
            <figcaption className="text-[11px] font-mono text-gray-500 uppercase tracking-widest mt-2">
              {props.value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
  block: {
    normal: function NormalBlock(props) {
      return <p className="mb-4 leading-relaxed">{props.children}</p>;
    },
    h2: function H2Block(props) {
      return (
        <h2 className="font-fraunces font-black text-2xl text-black tracking-tight mt-8 mb-3">
          {props.children}
        </h2>
      );
    },
    h3: function H3Block(props) {
      return (
        <h3 className="font-fraunces font-black text-xl text-black tracking-tight mt-6 mb-2">
          {props.children}
        </h3>
      );
    },
  },
};

export default function About() {
  const { data } = useLoaderData();

  if (!data) {
    return (
      <div className="min-h-screen bg-[#e8e2d9] flex items-center justify-center">
        <p className="font-mono text-sm text-gray-500">About page not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#e8e2d9] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-10 md:py-14">

        {data.title ? (
          <h1 className="font-fraunces font-black text-3xl md:text-5xl tracking-tight text-black mb-10 pb-6 border-b-2 border-black/70">
            {data.title}
          </h1>
        ) : null}

        <div className="text-gray-700 text-sm md:text-base font-mono leading-relaxed">

          {data.photoUrl ? (
            <img
              src={data.photoUrl}
              alt="Kim Rampling"
              className="float-left w-32 md:w-48 mr-6 mb-4 object-cover"
            />
          ) : null}

          {data.body ? (
            <PortableText value={data.body} components={portableTextComponents} />
          ) : null}

          <div className="clear-both" />

        </div>

      </div>
    </div>
  );
}
