import { useState, useEffect } from "react";
import { Plus, Bot } from "lucide-react";
import { CreateAgentModal } from "./CreateAgentModel";
import { getAgentById } from "../../services/apis/agentAPI";

interface Agent {
  id: string;
  name: string;
  useCase: string;
  status: "active" | "inactive";
}

export const AgentsList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "1",
      name: "Roadside Helper",
      useCase: "Roadside Assistance",
      status: "active",
    },
  ]);

  // Fetch agent details on mount
  useEffect(() => {
    const fetchAgentDetails = async () => {
      try {
        const agentData = await getAgentById();
        console.log('Fetched agent details:', agentData);
      } catch (error) {
        console.error('Error fetching agent details:', error);
      }
    };

    fetchAgentDetails();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#4F46E5]">
              Agents
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and create your AI Agents.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-[#4F46E5] text-white font-semibold rounded-lg shadow-lg hover:bg-[#4338CA] hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Agent
          </button>
          </div>

          {agents.length === 0 ? (
          <div className="bg-white p-12 text-center border-dashed border-2 border-gray-300 rounded-xl">
            <Bot className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900">No agents yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first AI agent to get started
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-[#4F46E5] text-white font-semibold rounded-lg shadow-lg hover:bg-[#4338CA] transition-all duration-200 flex items-center gap-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              Create Agent
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-sm text-gray-900">
                      AGENT NAME
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-sm text-gray-900">
                      USE CASE
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-sm text-gray-900">
                      STATUS
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-sm text-gray-900">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((agent) => (
                    <tr
                      key={agent.id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#4F46E5]/10 flex items-center justify-center">
                            <Bot className="h-5 w-5 text-[#4F46E5]" />
                          </div>
                          <span className="font-medium text-gray-900">{agent.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-purple-100 text-[#4F46E5] rounded-full text-sm font-normal">
                          {agent.useCase}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            agent.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {agent.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-[#4F46E5] hover:text-white hover:border-[#4F46E5] transition-all duration-200 text-sm">
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          )}
        </div>
      </div>

      <CreateAgentModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAgentCreated={(agent: Agent) => {
          setAgents([...agents, agent]);
          setIsModalOpen(false);
        }}
      />
    </>
  );
};
