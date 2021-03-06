import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "./../utils/createUrqlClient";
import { usePostsQuery } from "./../generated/graphql";
import React from "react";
import { Layout } from "../components/Layout";
import NextLink from "next/link";
import { Link } from "@chakra-ui/layout";

const Index = () => {
  const [{ data }] = usePostsQuery({
    variables: {
      limit: 10,
    },
  });
  return (
    <Layout>
      <NextLink href="/create-post">
        <Link>create post</Link>
      </NextLink>
      <br />
      {!data ? (
        <div>loading...</div>
      ) : (
        data.posts.map((p) => <div key={p.id}>{p.title}</div>)
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
