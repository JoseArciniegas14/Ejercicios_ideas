import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import { serialize } from 'next-mdx-remote/serialize';
import { Metadata } from 'next';

interface Post {
  slug: string;
  frontMatter: {
    title: string;
    date: string;
  };
}

const isFrontMatter = (data: any): data is { title: string; date: string } => {
  return data && typeof data.title === 'string' && typeof data.date === 'string';
};

const getPosts = async () => {
  const files = fs.readdirSync(path.join(process.cwd(), 'content/posts'));
  const posts = await Promise.all(files.map(async (filename) => {
    const filePath = path.join('content/posts', filename);
    const markdownWithMeta = fs.readFileSync(filePath, 'utf-8');
    const mdxSource = await serialize(markdownWithMeta, {
      mdxOptions: {
        remarkPlugins: [remarkFrontmatter, remarkGfm],
      },
    });

    if (!isFrontMatter(mdxSource.frontmatter)) {
      throw new Error('Invalid frontmatter');
    }

    return {
      slug: filename.replace('.mdx', ''),
      frontMatter: mdxSource.frontmatter,
    };
  }));

  return posts;
};

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Lista de posts',
};

const Home = async () => {
  const posts = await getPosts();

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>Blog</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts.map(({ slug, frontMatter }) => (
          <li key={slug} style={{ marginBottom: '20px' }}>
            <Link href={`/posts/${slug}`} style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
                border: '1px solid #ddd',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
            
                <h2>{frontMatter.title}</h2>
                <p>{frontMatter.date}</p>
             
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
