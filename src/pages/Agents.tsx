import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, MessageSquare } from 'lucide-react';
import Chat from '../components/Chat';
import AgentForm from '../components/AgentForm';

interface Agent {
  id: string;
  name: string;
  prompt: string;
  model: string;
}

const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
  const [chatWithAgent, setChatWithAgent] = useState<string | null>(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents');
      const data = await response.json();
      setAgents(data);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const handleSave = async (agent: Agent) => {
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agent),
      });

      if (response.ok) {
        fetchAgents();
        setShowModal(false);
        setCurrentAgent(null);
      }
    } catch (error) {
      console.error('Error saving agent:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/agents/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAgents(agents.filter(a => a.id !== id));
      }
    } catch (error) {
      console.error('Error deleting agent:', error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Agents</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Agent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{agent.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setChatWithAgent(agent.id)}
                  className="p-2 text-gray-500 hover:text-blue-500"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setCurrentAgent(agent);
                    setShowModal(true);
                  }}
                  className="p-2 text-gray-500 hover:text-blue-500"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(agent.id)}
                  className="p-2 text-gray-500 hover:text-red-500"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">Model: {agent.model}</p>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {agent.prompt.substring(0, 150)}...
              </pre>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <AgentForm
          agent={currentAgent}
          onSave={handleSave}
          onCancel={() => {
            setShowModal(false);
            setCurrentAgent(null);
          }}
        />
      )}

      {chatWithAgent && (
        <Chat
          agentId={chatWithAgent}
          onClose={() => setChatWithAgent(null)}
        />
      )}
    </div>
  );
}

export default Agents;