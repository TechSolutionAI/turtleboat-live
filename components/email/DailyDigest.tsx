import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
} from "@react-email/components";
import * as React from "react";

type DailyDigestProps = {
  name: string;
  count: number;
  link: string;
};

export default function DailyDigest({ name, count, link }: DailyDigestProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#ffffff", padding: "20px" }}>
        <Container>
          <Text>Hello {name}!</Text>

          <Text>
            Here is a summary of notifications from your CORE Community.
          </Text>

          <Text>You have {count} unread Notification{count !== 1 ? "s" : ""}.</Text>

          <Text>
            Please see all notifications{" "}
            <Link href={link} target="_blank">
              Click Here
            </Link>
          </Text>

          <Text>
            If the link is not working, please visit here:{" "}
            <Link href={link} target="_blank">
              {link}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
