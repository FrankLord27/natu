'use client';

import React from 'react';
import { SyncLoader } from 'react-spinners';
import styled, { useTheme } from 'styled-components';

const LoaderWrapper = styled.div<{ $fullScreen?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${p => p.$fullScreen ? '100vh' : '100%'};
  min-height: ${p => p.$fullScreen ? '100vh' : 'auto'};
`;

interface LoaderProps {
  size?: number;
  color?: string;
  className?: string;
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ 
  size = 15, 
  color, 
  className,
  fullScreen = false
}) => {
  const theme = useTheme();
  
  // Default to primary color if not specified
  const loaderColor = color || theme.colors.primary;

  return (
    <LoaderWrapper className={className} $fullScreen={fullScreen}>
      <SyncLoader 
        color={loaderColor} 
        size={size} 
        margin={4}
        speedMultiplier={0.8}
      />
    </LoaderWrapper>
  );
};
