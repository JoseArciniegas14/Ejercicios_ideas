import { GetStaticPaths, GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';

interface PostProps {
  source: MDXRemoteSerializeResult;
  frontMatter: {
    title: string;
    date: string;
  };
}

const PostPage = ({ source, frontMatter }: PostProps) => {
  return (
    <div>
      <h1>{frontMatter.title}</h1>
      <p>{frontMatter.date}</p>
      <MDXRemote {...source} />
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const files = fs.readdirSync(path.join('posts'));
  const paths = files.map((file) => ({
    params: { slug: file.replace('.mdx', '') },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params!;
  const markdownWithMeta = fs.readFileSync(
    path.join('posts', `${slug}.mdx`),
    'utf-8'
  );

  const { data: frontMatter, content } = matter(markdownWithMeta);
  const mdxSource = await serialize(content);

  return {
    props: {
      source: mdxSource,
      frontMatter,
    },
  };
};

export default PostPage;
