export enum AgentRole {
  FINANCE = 'FINANCE',
  GROWTH = 'GROWTH',
  TECH = 'TECH',
  LEGAL = 'LEGAL',
  SYNTHESIS = 'SYNTHESIS',
  USER = 'USER'
}

export interface AgentProfile {
  id: AgentRole;
  name: string;
  title: string;
  description: string;
  color: string;
  iconName: string;
}

export interface Message {
  id: string;
  role: AgentRole;
  content: string;
  timestamp: number;
  mode: 'SMS' | 'DASHBOARD';
  isStreaming?: boolean;
  vote?: string | null;
  confidence?: number | null;
}

export interface BoardState {
  messages: Message[];
  isConsulting: boolean;
  inputMode: 'SMS' | 'DASHBOARD';
}
