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

interface LemonadeReminderProps {
  inviteAddress: string;
}

export default function LemonadeReminder({ inviteAddress }: LemonadeReminderProps) {
  return (
    <Html>
      <Head />
      <Preview>No participants joined your 50 Ways to Lemonade Battle</Preview>
      <Body style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
        <Container>
          <Text>Hello</Text>

          <Text>
            No participants joined to your <strong>50 Ways to Lemonade Battle</strong> you created.
            Please{" "}
            <Link href={inviteAddress} target="_blank" rel="noopener noreferrer">
              go
            </Link>{" "}
            to your Lemonade Battle and invite new participants.
          </Text>

          <Text>
            If the link is not working, please visit here:{" "}
            <Link href={inviteAddress} target="_blank" rel="noopener noreferrer">
              {inviteAddress}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
