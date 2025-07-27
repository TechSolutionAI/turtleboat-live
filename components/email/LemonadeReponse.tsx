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

interface LemonadeResponseProps {
  fromName: string;
  ventureTitle: string;
  notificationlink: string;
}

export default function LemonadeResponse({
  fromName,
  ventureTitle,
  notificationlink,
}: LemonadeResponseProps) {
  return (
    <Html>
      <Head />
      <Preview>{`${fromName} posted a message in 50 Ways to Lemonade Battle`}</Preview>
      <Body style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
        <Container>
          <Text>
            {fromName} posted a message in <strong>50 Ways to Lemonade Battle</strong> - {ventureTitle}.
          </Text>

          <Text>
            Please click{" "}
            <Link href={notificationlink} target="_blank" rel="noopener noreferrer">
              Here
            </Link>{" "}
            to see messages.
          </Text>

          <Text>
            If the link is not working, please visit here:{" "}
            <Link href={notificationlink} target="_blank" rel="noopener noreferrer">
              {notificationlink}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
