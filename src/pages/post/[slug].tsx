import { GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';

import { RichText } from 'prismic-dom'

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  return (
    <h1>
      teste
    </h1>
  )
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient();
  // const posts = await prismic.query();

  return {
    paths: [],
    fallback: true
  }
};



export const getStaticProps: GetStaticProps = async ({ params, previewData }) => {
  const prismic = getPrismicClient();
  const { slug } = params
  const response = await prismic.getByUID('posts', String(slug), {
    ref: previewData?.ref || null,
  })

  console.log(response)

  const post = {
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      // content: {
      //   heading: response.data.content.heading,
      //   body: {
      //     text: RichText.asHtml(response.data.content.body)
      //   }
      // }
    }
  }

  return {
    props: {
      post
    },
    revalidate: 1800,
  };
};


// export const getStaticProps: GetStaticProps = async ({
//   params
// }) => {
//   const prismic = getPrismicClient();
//   const { slug } = params;
//   const response = await prismic.getByUID('posts', String(slug), {
//     ref: previewData?.ref || null,
//   });



//   const contentBody = response.data.content.map(content => {
//     return {
//       heading: content.heading,
//       body: [...content.body],
//     };
//   });

//   const post = {
//     uid: response.uid,
//     first_publication_date: response.first_publication_date,
//     last_publication_date: response.last_publication_date,
//     data: {
//       title: RichText.asText(response.data.title),
//       subtitle: RichText.asText(response.data.subtitle),
//       author: RichText.asText(response.data.author),
//       banner: {
//         url: response.data.banner.url,
//       },
//       content: contentBody,
//     },
//   };

//   return {
//     props: {
//       post
//     },
//     revalidate: 1800,
//   };
// };
