import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Preview,
} from "@react-email/components";

interface PostCoreVideoProps {
  name: string[] | undefined;
  link: string;
}

export default function PostCoreVideo({ name, link }: PostCoreVideoProps) {
  return (
    <Html>
      <Head />
      <Preview>{`${name} posted a new video`}</Preview>
      <Body style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
        <Container>
          <Text>
            {name} posted a new video.
            Please{" "}
            <Link href={link} target="_blank" rel="noopener noreferrer">
              Click
            </Link>{" "}
            here to see the video and approve it.
          </Text>

          <Text>
            If the link is not working, please visit here:{" "}
            <Link href={link} target="_blank" rel="noopener noreferrer">
              {link}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
