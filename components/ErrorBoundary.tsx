'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';
import { AlertCircle, RefreshCcw, Home, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

const ErrorContainer = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 60vh; padding: 40px; text-align: center;
`;

const GlassCard = styled(motion.div)`
  background: white; border-radius: 32px; padding: 50px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.05); border: 1px solid #f0f0f0;
  max-width: 600px; width: 100%;
`;

const IconPulse = styled(motion.div)`
  width: 80px; height: 80px; border-radius: 50%; background: #fff5f5;
  display: flex; align-items: center; justify-content: center;
  color: #ff5252; margin: 0 auto 30px;
`;

const Title = styled.h2`
  font-size: 2rem; font-weight: 900; color: #1a1a1a; margin-bottom: 15px; letter-spacing: -0.5px;
`;

const Desc = styled.p`
  font-size: 1rem; color: #666; line-height: 1.6; margin-bottom: 35px;
`;

const ButtonGroup = styled.div`display: flex; gap: 15px; justify-content: center;`;

const ActionBtn = styled.button<{ $primary?: boolean }>`
  display: flex; align-items: center; gap: 10px; padding: 14px 28px;
  border-radius: 16px; font-weight: 800; font-size: 0.95rem; cursor: pointer; transition: all 0.3s;
  border: none;
  background: ${p => p.$primary ? p.theme.colors.primary : '#1a1a1a'};
  color: white;
  &:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
`;

const DebugPanel = styled.div`
  margin-top: 40px; text-align: left; background: #fafafa; border-radius: 16px;
  padding: 20px; border: 1px solid #eee; width: 100%;
  summary { font-size: 0.8rem; font-weight: 800; color: #999; cursor: pointer; display: flex; align-items: center; gap: 8px; }
  pre { font-family: 'Monaco', monospace; font-size: 0.75rem; color: #ff5252; margin-top: 15px; overflow: auto; max-height: 200px; }
`;

interface Props { children?: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Lead Agent - Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <GlassCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <IconPulse animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
              <AlertCircle size={40} />
            </IconPulse>
            <Title>Interrupción en el Sistema</Title>
            <Desc>
              Lo sentimos, Frank. Se ha producido un error inesperado al renderizar este componente. 
              El equipo técnico (Agentes IA) ha sido notificado automáticamente.
            </Desc>
            
            <ButtonGroup>
              <ActionBtn $primary onClick={() => window.location.reload()}>
                <RefreshCcw size={18} /> Reintentar Cargar
              </ActionBtn>
              <ActionBtn onClick={() => window.location.href = '/admin'}>
                <Home size={18} /> Volver al Inicio
              </ActionBtn>
            </ButtonGroup>

            {process.env.NODE_ENV === 'development' && (
              <DebugPanel>
                <details>
                  <summary><Terminal size={14} /> Ver Detalles Técnicos (Debug)</summary>
                  <pre>{this.state.error?.stack || this.state.error?.toString()}</pre>
                </details>
              </DebugPanel>
            )}
          </GlassCard>
        </ErrorContainer>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
