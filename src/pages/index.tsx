import { useState } from 'react'

import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client'
import { format } from 'date-fns'
import Link from 'next/link'

import commonStyles from '../styles/common.module.scss';
import Header from '../components/Header'
import styles from './home.module.scss';
import ptBR from 'date-fns/locale/pt-BR';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostProps {
  posts: Post[];
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {

  const [nextPg, setNextPg] = useState<string>(postsPagination.next_page)
  const [posts, setPosts] = useState<Post[]>(postsPagination.results)

  async function handleLoadMorePosts(): Promise<void> {

    const response = await fetch(nextPg).then(
      response => response.json()
    )

    setNextPg(response.next_page)

    response.results.map((post: Post) => {

      const data = {
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,

        }
      }

      setPosts([...posts, data])
    })
    return response
  }


  return (

    <>
      <Header />
      <main className={styles.mainContainer}>
        {posts.map((post, idx) => (

          <Link href={`/post/${post.uid}`}>
            <div key={idx} className={styles.postContainer}>
              <p className={styles.title}> {post.data.title}</p>
              <p className={styles.subtitle}> {post.data.subtitle}</p>

              <div className={styles.footerPostContainer}>
                <div className={styles.calendarContainer}>
                  <img src="/calendar.svg" alt="calendar" />
                  <p>{format(new Date(post.first_publication_date), 'dd MMM yyyy', { locale: ptBR })}</p>
                </div>

                <div className={styles.calendarContainer}>
                  <img src="/user.svg" alt="user" />
                  <p>{post.data.author}</p>
                </div>
              </div>
            </div>

          </Link>

        ))}

        {nextPg !== null &&
          <button
            className={styles.pagination}
            onClick={() => handleLoadMorePosts()}
          >
            Carregar mais posts
          </button>
        }

      </main>
    </>

  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ], {
    pageSize: 1,
  });

  const posts = postsResponse.results.map((post: Post) => {

    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,

      }
    }
  })

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts,
      }
    }
  }
};
