import React from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
} from 'react-flow-renderer';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
  },
];

const initialEdges: Edge[] = [];

const Flows = () => {
  return (
    <div className="h-full p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Agent Flows</h1>
      </div>
      <div className="h-[calc(100vh-12rem)] border border-gray-200 rounded-lg overflow-hidden">
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
};

export default Flows;