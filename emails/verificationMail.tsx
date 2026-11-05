import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationMailTemplate({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verify your Bebaak email</title>
      </Head>
      <Preview>Your Bebaak verification code: {otp}</Preview>
      <Body
        style={{
          backgroundColor: "#f4f4f2",
          color: "#181818",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          margin: 0,
          padding: "40px 16px",
        }}
      >
        <Container
          style={{
            maxWidth: "480px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            border: "1px solid #e3e3e0",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <Section
            style={{
              borderBottom: "1px solid #e3e3e0",
              padding: "20px 28px",
            }}
          >
            <Text
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              bebaak.
            </Text>
          </Section>

          <Section style={{ padding: "32px 28px 8px" }}>
            <Text
              style={{
                margin: "0 0 12px",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#8a8a86",
              }}
            >
              Email verification
            </Text>
            <Heading
              style={{
                margin: "0 0 16px",
                fontSize: "28px",
                lineHeight: "1.15",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                color: "#181818",
              }}
            >
              Hello {username},
            </Heading>
            <Text
              style={{
                margin: 0,
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#555552",
              }}
            >
              Thanks for joining Bebaak. Enter this one-time code to finish
              creating your account. It expires in 15 minutes.
            </Text>
          </Section>

          <Section style={{ padding: "16px 28px 8px" }}>
            <Text
              style={{
                margin: 0,
                padding: "20px 16px",
                backgroundColor: "#f4f4f2",
                border: "1px solid #e3e3e0",
                borderRadius: "6px",
                fontSize: "30px",
                fontWeight: 600,
                letterSpacing: "0.32em",
                textAlign: "center",
                color: "#181818",
              }}
            >
              {otp}
            </Text>
          </Section>

          <Section style={{ padding: "8px 28px 28px" }}>
            <Text
              style={{
                margin: 0,
                fontSize: "12px",
                lineHeight: "1.6",
                color: "#8a8a86",
              }}
            >
              If you did not request this code, you can safely ignore this
              email. No account will be created without verification.
            </Text>
          </Section>

          <Hr style={{ borderColor: "#e3e3e0", margin: 0 }} />

          <Section style={{ padding: "18px 28px" }}>
            <Text
              style={{
                margin: 0,
                fontSize: "10px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#8a8a86",
              }}
            >
              Bebaak · Anonymous by design
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
