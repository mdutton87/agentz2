import create from 'zustand';

interface Agent {
  id: string;
  name: string;
  prompt: string;
  model: string;
}

interface AgentStore {
  agents: Agent[];
  addAgent: (agent: Agent) => void;
  updateAgent: (agent: Agent) => void;
  deleteAgent: (id: string) => void;
}

const useAgentStore = create<AgentStore>((set) => ({
  agents: [],
  addAgent: (agent) =>
    set((state) => ({ agents: [...state.agents, agent] })),
  updateAgent: (agent) =>
    set((state) => ({
      agents: state.agents.map((a) => (a.id === agent.id ? agent : a)),
    })),
  deleteAgent: (id) =>
    set((state) => ({
      agents: state.agents.filter((a) => a.id !== id),
    })),
}));

export default useAgentStore;