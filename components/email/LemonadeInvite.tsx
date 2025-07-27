import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
} from "@react-email/components";

type LemonadeInviteProps = {
  inviteAddress: string;
};

export default function LemonadeInvite({ inviteAddress }: LemonadeInviteProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "Arial, sans-serif", padding: "20px", backgroundColor: "#ffffff" }}>
        <Container>
          <Text>Hello</Text>

          <Text>
            You have been invited to participate in <strong>50 Ways to Lemonade Battle of Entrepreneurial Wits</strong> for some good-natured divergent thinking. There are 4 slots available to participate on a first come basis. Please click{" "}
            <Link href={inviteAddress} target="_blank" rel="noopener noreferrer">
              here
            </Link>{" "}
            to join this Battle hosted on Turtle Boat.
          </Text>

          <Text>
            The initiator has included an audio elevator pitch to start. Each participant has 20 comments available to poke holes, expand on narrative, and go a bit wild with creativity. After you’ve reached your 20 comments, see how creatively you can devise an improved elevator pitch connecting whatever dots you see from the collective battlefield. Have fun and earn some tokens!
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
