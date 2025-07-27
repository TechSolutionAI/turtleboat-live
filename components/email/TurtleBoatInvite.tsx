import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
} from "@react-email/components";
import * as React from "react";

type TurtleBoatInviteProps = {
  type: number;
  inviteAddress: string;
  note?: string;
};

export default function TurtleBoatInvite({
  type,
  inviteAddress,
  note = "",
}: TurtleBoatInviteProps) {
  const content = (
    <>
      <Text>Hello</Text>

      <Text>
        You have been invited to Turtle Boat either because you have been
        accepted into a yCITIES program as a mentee or mentor, or because a
        current CORE member felt that you’d be a great addition to our
        community.
      </Text>

      <Text>
        Please click{" "}
        <Link href={inviteAddress} target="_blank">
          here
        </Link>{" "}
        to register, as the Turtle Boat platform is what we use to deliver
        curriculum, and give/receive support. Once you finish registering, we
        will create a personal Innovation Journal and Thinkspace (accessed
        through the My Ventures Tab) to track your thoughts and research,
        access tools, and save your work. If you do not register, you can still
        use the tools on our Toolbox tab, but you will not be able to save your
        work into your own Thinkspace, or access the community.
      </Text>

      <Text>
        For more info on yCITIES, please visit our website:{" "}
        <Link href="https://youthcities.org/" target="_blank">
          www.youthcities.org
        </Link>
      </Text>
    </>
  );

  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#fff" }}>
        <Container>
          {/* Shared content for type 0 and 1 */}
          {type === 0 || type === 1 ? content : null}

          <Text>
            If the link is not working, please visit here:{" "}
            <Link href={inviteAddress} target="_blank">
              {inviteAddress}
            </Link>
          </Text>

          {note && (
            <>
              <Text>Note from referrer:</Text>
              <Text>{note}</Text>
            </>
          )}
        </Container>
      </Body>
    </Html>
  );
}
