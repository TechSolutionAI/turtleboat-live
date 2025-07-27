import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
} from "@react-email/components";
import * as React from "react";

type ForwardRequestProps = {
  summary: string;
  name: string;
  note: string[] | undefined;
  type: string;
  specificHelpRequest: string;
  whatYouDid: string;
  replyEmail?: string;
};

export default function ForwardRequest({
  summary,
  name,
  note,
  type,
  specificHelpRequest,
  whatYouDid,
  replyEmail = "",
}: ForwardRequestProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#ffffff", padding: "20px" }}>
        <Container>
          <Text>{summary}</Text>

          <Text>
            <strong>Intro Message from {name}</strong>
          </Text>
          <Text>{note}</Text>

          <Text>
            <strong>Type of ERA</strong>
          </Text>
          <Text>{type}</Text>

          <Text>
            <strong>Specific Help Request</strong>
          </Text>
          <Text>{specificHelpRequest}</Text>

          <Text>
            <strong>What did you do to address this problem on your own?</strong>
          </Text>
          <Text>{whatYouDid}</Text>

          {replyEmail && (
            <Text>
              If you would like to answer, please reply to{" "}
              <Link href={`mailto:${replyEmail}`} target="_blank">
                {replyEmail}
              </Link>
            </Text>
          )}
        </Container>
      </Body>
    </Html>
  );
}
