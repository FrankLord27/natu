'use client';

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  width?: string;
}

const Wrapper = styled.div<{ $width?: string }>`
  position: relative;
  width: ${props => props.$width || '200px'};
  font-family: inherit;
`;

const SelectBox = styled.div<{ $isOpen: boolean }>`
  background: white;
  border: 2px solid ${props => props.$isOpen ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }

  span {
    font-size: 0.9rem;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
  }
`;

const DropdownMenu = styled(motion.ul)`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  border: 1px solid rgba(0,0,0,0.05);
  margin: 0;
  padding: 8px;
  list-style: none;
  z-index: 1000;
  overflow: hidden;
`;

const DropdownItem = styled.li<{ $selected: boolean }>`
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.$selected ? props.theme.colors.primary : props.theme.colors.textLight};
  background: ${props => props.$selected ? props.theme.colors.primaryPale : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$selected ? props.theme.colors.primaryPale : '#f5f5f5'};
    color: ${props => props.theme.colors.primary};
  }
`;

const IconWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  color: #999;
`;

export const CustomDropdown: React.FC<CustomDropdownProps> = ({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Seleccionar...',
  width 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <Wrapper ref={containerRef} $width={width}>
      <SelectBox $isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <IconWrapper animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={18} />
        </IconWrapper>
      </SelectBox>

      <AnimatePresence>
        {isOpen && (
          <DropdownMenu
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {options.map((option) => (
              <DropdownItem
                key={option.value}
                $selected={value === option.value}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        )}
      </AnimatePresence>
    </Wrapper>
  );
};
