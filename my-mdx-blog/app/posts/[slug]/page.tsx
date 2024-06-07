import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote/rsc';
import { serialize } from 'next-mdx-remote/serialize';
import { notFound } from 'next/navigation';

interface PostProps {
  params: {
    slug: string;
  };
}

const getPost = async (slug: string) => {
  const filePath = path.join(process.cwd(), 'content/posts', `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const markdownWithMeta = fs.readFileSync(filePath, 'utf-8');
  const { data: frontMatter, content } = matter(markdownWithMeta);
  const mdxSource = await serialize(content);
  return { frontMatter, mdxSource };
};

const PostPage = async ({ params }: PostProps) => {
  const { slug } = params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1>{post.frontMatter.title}</h1>
      <p>{post.frontMatter.date}</p>
      <MDXRemote {...post.mdxSource} />
    </div>
  );
};

export default PostPage;
