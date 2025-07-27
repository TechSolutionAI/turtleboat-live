import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
} from "@react-email/components";
import * as React from "react";

type RequestERAProps = {
  specificHelpRequest: string[] | undefined;
  whatYouDid: string[] | undefined;
  link: string;
};

export default function RequestERA({
  specificHelpRequest,
  whatYouDid,
  link,
}: RequestERAProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#ffffff", padding: "20px" }}>
        <Container>
          <Text>
            A fellow CORE Member is seeking a quick Entrepreneurial Roadside Assistance.
            <br />
            Summary of request is below.
            <br />
            Please choose one of the actions to help them get unstuck so they can continue with their entrepreneurial journey.
          </Text>

          <Text>
            <strong>Specific Help Request</strong>
          </Text>
          <Text>{specificHelpRequest}</Text>

          <Text>
            <strong>What did you do to address this problem on your own?</strong>
          </Text>
          <Text>{whatYouDid}</Text>

          <Text>
            Please see details via{" "}
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
