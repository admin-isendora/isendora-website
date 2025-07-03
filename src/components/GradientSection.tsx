import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { createGradientGlow } from '@/lib/gradient-utils';

interface GradientSectionProps {
  children: React.ReactNode;
  type?: 'transition' | 'accent' | 'glow';
  isDarkMode?: boolean;
  className?: string;
}