import {
    Html,
    Head,
    Preview,
    Heading,
    Text,
    Row,
    Section,
} from "@react-email/components";

interface VerificationEmailProps {
    username: string,
    otp: string,
}

export default function VerificationEmail({ username, otp }
    : VerificationEmailProps) {
    return (
        <Html lang="en" dir="ltr">
            <Head>
                <title>Verification Code</title>
            </Head>
            <Preview>Here&apos;s your Verification code: {otp} </Preview>
            <Section>
                <Row>
                    <Heading as="h1">Hello {username}</Heading>
                    <Text>Your OTP is {otp}</Text>
                </Row>
            </Section>
        </Html>
    );
}