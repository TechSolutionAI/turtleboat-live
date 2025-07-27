import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
} from "@react-email/components";
import * as React from "react";

type ResponseERAProps = {
  subject: string;
  note: string[] | undefined;
  link: string;
};

export default function ResponseERA({ subject, note, link }: ResponseERAProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#ffffff", padding: "20px" }}>
        <Container>
          <Text>{subject}</Text>
          <Text>{note}</Text>

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
