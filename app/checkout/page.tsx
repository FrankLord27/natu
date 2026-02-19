'use client';

import React from 'react';
import styled from 'styled-components';
import CheckoutWizard from '@/components/checkout/CheckoutWizard';

const Page = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  padding-top: 100px; /* Header space */
  padding-bottom: 60px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 900;
    color: #333;
    margin-bottom: 10px;
  }
  
  p {
    color: #666;
    font-size: 1.1rem;
  }
`;

export default function CheckoutPage() {
  return (
    <Page>
      <Container>
        <Header>
          <h1>Finalizar Compra</h1>
          <p>Completa tus datos para recibir tu pedido</p>
        </Header>
        <CheckoutWizard />
      </Container>
    </Page>
  );
}
