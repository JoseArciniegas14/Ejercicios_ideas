import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import matter from 'gray-matter';

interface Post {
  slug: string;
  frontMatter: {
    title: string;
    date: string;
  };
}

interface HomeProps {
  posts: Post[];
}

const Home = ({ posts }: HomeProps) => {
  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {posts.map(({ slug, frontMatter }) => (
          <li key={slug}>
            <Link href={`/posts/${slug}`}>
              <a>{frontMatter.title}</a>
            </Link>
            <p>{frontMatter.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const getStaticProps = async () => {
  const files = fs.readdirSync(path.join('posts'));

  const posts = files.map((filename) => {
    const markdownWithMeta = fs.readFileSync(
      path.join('posts', filename),
      'utf-8'
    );

    const { data: frontMatter } = matter(markdownWithMeta);

    return {
      slug: filename.replace('.mdx', ''),
      frontMatter,
    };
  });

  return {
    props: {
      posts,
    },
  };
};

export default Home;
