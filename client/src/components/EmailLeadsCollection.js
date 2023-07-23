import React from "react";
import { Form} from "react-bootstrap";
import { EmptyState, Image, TextButton, Input, InputWithLabel } from "@wix/design-system";
import { Divider, Send } from "@wix/wix-ui-icons-common";


export function EmailLeadsCollection() {
  const [email, setEmail] = React.useState("");

  const handleSubmit = () => {
    // Send the email to your server.
  };

  return (
    // <Form onSubmit={handleSubmit}>
    <EmptyState>
      <InputWithLabel
        type="email"
        placeholder="Enter your email"
        label="Your Email Address*"
        // onChange={(e) => setEmail(e.target.value)}
      />
      <TextButton 
      // prefixIcon={<Send />}
      >Send</TextButton>
    </EmptyState>
    // </Form>
  );
};

export default EmailLeadsCollection;
