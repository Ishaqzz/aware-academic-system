
import React from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import ChatBot from '@/components/ChatBot';

const ChatPage = () => {
  return (
    <SidebarLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Campus Buddy Chat</h1>
          <p className="text-muted-foreground">Your AI assistant for academic support and information</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <ChatBot />
          </div>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Suggested Topics</h3>
              <ul className="space-y-1.5 text-sm">
                <li className="text-blue-600 hover:underline cursor-pointer">How many black marks before suspension?</li>
                <li className="text-blue-600 hover:underline cursor-pointer">Where can I find my syllabus?</li>
                <li className="text-blue-600 hover:underline cursor-pointer">Show me today's events</li>
                <li className="text-blue-600 hover:underline cursor-pointer">How do I appeal a black mark?</li>
                <li className="text-blue-600 hover:underline cursor-pointer">I'm feeling stressed</li>
                <li className="text-blue-600 hover:underline cursor-pointer">Tell me about upcoming competitions</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium mb-2">About Campus Buddy</h3>
              <p className="text-sm text-muted-foreground">
                Campus Buddy is your AI assistant designed to help with academic questions, provide information about events, and offer support when you're feeling stressed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default ChatPage;
