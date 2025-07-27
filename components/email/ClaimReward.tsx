import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text
} from "@react-email/components";

interface ClaimRewardProps {
  summary: string;
  redemption: string;
  oldBalance: number | string;
  transactionAmount: number | string;
  newBalance: number | string;
}

const ClaimReward = ({
  summary,
  redemption,
  oldBalance,
  transactionAmount,
  newBalance,
}: ClaimRewardProps) => {
  return (
    <Html>
      <Head />
      <Preview>Claim Reward Summary</Preview>
      <Body style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
        <Container>
          <Text>{summary}</Text>

          <Text>
            <strong>Redemption Summary:</strong><br />
            {redemption}
          </Text>

          <Text style={{ paddingTop: "15px" }}>
            <strong>Balance before Transaction:</strong> {oldBalance}
          </Text>

          <Text>
            <strong>Token Amount for Transaction:</strong> {transactionAmount}
          </Text>

          <Text>
            <strong>New Balance:</strong> {newBalance}
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ClaimReward;
