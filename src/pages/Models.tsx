import React, { useState } from 'react';
import { Download, CheckCircle, XCircle } from 'lucide-react';

interface Model {
  id: string;
  name: string;
  description: string;
  size: string;
  installed: boolean;
}

const Models = () => {
  const [models, setModels] = useState<Model[]>([
    {
      id: '1',
      name: 'Llama 2',
      description: 'Meta\'s advanced language model',
      size: '4GB',
      installed: true,
    },
    {
      id: '2',
      name: 'Mistral',
      description: 'Efficient and powerful language model',
      size: '4.1GB',
      installed: false,
    },
    {
      id: '3',
      name: 'Code Llama',
      description: 'Specialized for code generation',
      size: '4.3GB',
      installed: false,
    },
  ]);

  const toggleInstall = async (modelId: string) => {
    setModels(models.map(model => 
      model.id === modelId 
        ? { ...model, installed: !model.installed }
        : model
    ));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Language Models</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {models.map((model) => (
          <div
            key={model.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {model.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{model.description}</p>
                <p className="mt-2 text-sm text-gray-600">Size: {model.size}</p>
              </div>
              <div className="flex items-center space-x-2">
                {model.installed ? (
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-1" />
                    Installed
                  </span>
                ) : (
                  <button
                    onClick={() => toggleInstall(model.id)}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Install
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Models;