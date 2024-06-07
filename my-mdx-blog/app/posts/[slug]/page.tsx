import fs from 'fs';
import path from 'path';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { serialize } from 'next-mdx-remote/serialize';
import { notFound } from 'next/navigation';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';

interface PostProps {
  params: {
    slug: string;
  };
}

interface FrontMatter {
  title: string;
  date: string;
}

const isFrontMatter = (data: any): data is FrontMatter => {
  return data && typeof data.title === 'string' && typeof data.date === 'string';
};

const getPost = async (slug: string) => {
  const filePath = path.join(process.cwd(), 'content/posts', `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const markdownWithMeta = fs.readFileSync(filePath, 'utf-8');
  const mdxSource = await serialize(markdownWithMeta, {
    mdxOptions: {
      remarkPlugins: [remarkFrontmatter, remarkGfm],
    },
  });

  console.log("Frontmatter:", mdxSource.frontmatter);
  if (!isFrontMatter(mdxSource.frontmatter)) {
      throw new Error('Invalid frontmatter');
  }
  return { frontMatter: mdxSource.frontmatter, mdxSource };
};

const PostPage = async ({ params }: PostProps) => {
  const { slug } = params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>{post.frontMatter.title}</h1>
      <p>{post.frontMatter.date}</p>
      <MDXRemote {...post.mdxSource} />
    </div>
  );
};

export default PostPage;
