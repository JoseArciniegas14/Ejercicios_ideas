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

const getPosts = () => {
  const files = fs.readdirSync(path.join(process.cwd(), 'content/posts'));
  const posts = files.map((filename) => {
    const markdownWithMeta = fs.readFileSync(
      path.join('content/posts', filename),
      'utf-8'
    );
    const { data: frontMatter } = matter(markdownWithMeta);
    return {
      slug: filename.replace('.mdx', ''),
      frontMatter,
    };
  });
  return posts;
};

const Home = async () => {
  const posts = getPosts();

  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {posts.map(({ slug, frontMatter }) => (
          <li key={slug}>
            <Link href={`/posts/${slug}`}>
              {frontMatter.title}
            </Link>
            <p>{frontMatter.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
