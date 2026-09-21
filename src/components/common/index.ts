// ─────────────────────────────────────────────────────────────
// Common UI primitives — barrel export
// Usage: import { Button, Card, Modal } from '@/components/common';
// ─────────────────────────────────────────────────────────────

// Core interactive
export { Button } from './Button';
export { Input } from './Input';

// Layout & surfaces
export { Card } from './Card';
export { Modal } from './Modal';

// Display
export { Avatar } from './Avatar';
export { Badge } from './Badge';
export { Spinner } from './Spinner';
export { EmptyState } from './EmptyState';

// Feedback & overlays
export { Toast } from './Toast';
export { ConfirmDialog } from './ConfirmDialog';

// ─────────────────────────────────────────────────────────────
// Type re-exports (props) — optional, keeps consumers tidy
// ─────────────────────────────────────────────────────────────
export type { ButtonHTMLAttributes, InputHTMLAttributes, HTMLAttributes } from 'react';