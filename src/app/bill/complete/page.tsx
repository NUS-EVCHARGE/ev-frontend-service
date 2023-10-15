"use client";
import React from "react";
import { Card, Space, Typography, Button } from "antd";
const { Title, Text } = Typography;

interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

function paymentCompletePage({ params, searchParams }: PageProps) {
  return (
    <Card>
      <Space direction="vertical" align="center">
          <Title>
              Payment Complete
          </Title>
          <Text>
              Thank you for your payment. We willl send you a confirmation email.
          </Text>
      </Space>
    </Card>
  );
}

export default paymentCompletePage;