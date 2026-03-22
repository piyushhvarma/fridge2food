"use client";

import { useEffect, useRef, useState } from "react";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import type { Recipe } from "@/lib/schema";
import { useChat } from "ai/react";
import { LineShadowText } from "@/components/ui/line-shadow-text";
import PhysicsPlayground from "@/components/PhysicsPlayground";

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
  ? DeepPartial<U>[]
  : T[P] extends object
  ? DeepPartial<T[P]>
  : T[P];
};



export default function Home() {
  const { messages, input, setInput, append, isLoading } = useChat({
    api: "/api/chat",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (messageText: string) => {
    if (!messageText.trim()) return;
    append({ role: 'user', content: messageText });
  };

  return (
    <div
      className="flex h-[100dvh] w-full flex-col bg-[url('/background1.gif')] bg-cover bg-center bg-no-repeat overflow-hidden relative items-center rounded-none border-none p-0"
    >
      <div className="absolute inset-0 z-0">
        <PhysicsPlayground />
      </div>

      {/* Top-Left Logo (Persistent) */}
      <header className="absolute top-0 left-0 p-2 sm:p-4 z-50 pointer-events-none">
        <img src="/1.gif" alt="fridge2food" className="h-12 sm:h-16 w-auto pointer-events-auto drop-shadow-lg object-contain" />
      </header>

      {/* Scrollable Chat Area */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 pt-20 sm:pt-24 pb-[180px] sm:pb-32 w-full no-scrollbar flex flex-col items-center relative z-10 pointer-events-none">
        <div className="w-full max-w-4xl flex flex-col gap-6">

          {/* Initial Welcome Message */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full min-h-[50vh] sm:min-h-[60vh] animate-in fade-in duration-700 w-full px-4 relative z-20">
              <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white drop-shadow-lg mb-8 text-center leading-tight">
                What's in your{" "}
                <LineShadowText className="italic" shadowColor="black">
                  fridge?
                </LineShadowText>
              </h1>

              <div className="w-full max-w-2xl shadow-lg rounded-[1.5rem] bg-black/40 backdrop-blur-md border border-white/20 z-10 transition-all mb-6 pointer-events-auto">
                <PromptInputBox
                  value={input}
                  onChange={setInput}
                  onSend={handleSend}
                  isLoading={isLoading}
                  placeholder="Type ingredients like: paneer, egg, chicken…"
                />
              </div>

              <div className="w-full max-w-3xl z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 pointer-events-none">
                <PantryQuickSelect
                  items={[
                    "Paneer", "Egg", "Chicken", "Milk", "Cheese", "Flour",
                    "Besan", "Chilli", "Masala", "Potato", "Peas", "Capsicum"
                  ]}
                  onSelect={(item) => {
                    const separator = input.trim() ? ", " : "";
                    setInput(input + separator + item);
                  }}
                />
              </div>
            </div>
          )}

          {/* Render Messages */}
          {messages.map(m => (
            <div key={m.id} className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="flex-shrink-0 mr-2 sm:mr-3 mt-1 h-8 w-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-sm text-base">
                  🍳
                </div>
              )}

              <div className={`flex flex-col gap-2 w-full max-w-[90%] sm:max-w-[85%] ${m.role === 'user' ? 'items-end' : 'items-start'} pointer-events-none`}>

                {/* Text Content */}
                {m.content && (
                  <div className={`pointer-events-auto px-4 py-3 rounded-2xl text-[18px] sm:text-[20px] leading-relaxed shadow-sm whitespace-pre-wrap flex-shrink ${m.role === 'user' ? 'bg-amber-600/90 text-white rounded-br-sm backdrop-blur-sm border border-amber-500/50' : 'bg-black/60 backdrop-blur-md border border-white/20 text-white rounded-bl-sm'
                    }`}>
                    {m.content}
                  </div>
                )}

                {/* Tool Invocations (Recipes) */}
                {m.toolInvocations?.map(toolInvocation => {
                  if (toolInvocation.toolName === 'provide_recipe') {
                    return (
                      <div key={toolInvocation.toolCallId} className="w-full mt-2">
                        <StreamedRecipe recipe={toolInvocation.args as DeepPartial<Recipe>} />
                      </div>
                    )
                  }
                })}

              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex justify-start items-center gap-2 sm:gap-3 text-white drop-shadow-md pl-10 sm:pl-11 pr-4">
              <div className="h-6 w-6 shrink-0 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center animate-pulse border border-white/20 text-xs">
                🍳
              </div>
              <span className="text-lg font-medium animate-pulse mt-1">Cooking something for you...</span>
            </div>
          )}

          {/* Smart Suggestions */}
          {messages.length > 0 && !isLoading && messages[messages.length - 1].role === 'assistant' && (
            <div className="flex flex-wrap gap-2 mt-4 animate-in slide-in-from-bottom-2 duration-500 pl-10 sm:pl-11 pr-4 pb-4 pointer-events-none">
              <button onClick={() => append({ role: 'user', content: "Give another recipe" })} className="pointer-events-auto text-sm font-semibold px-4 py-2 border border-white/20 bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors rounded-full shadow-sm drop-shadow-md">
                Give another recipe
              </button>
              <button onClick={() => append({ role: 'user', content: "Make it healthy" })} className="pointer-events-auto text-sm font-semibold px-4 py-2 border border-white/20 bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors rounded-full shadow-sm drop-shadow-md">
                Make it healthy
              </button>
              <button onClick={() => append({ role: 'user', content: "Quick recipe only" })} className="pointer-events-auto text-sm font-semibold px-4 py-2 border border-white/20 bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors rounded-full shadow-sm drop-shadow-md">
                Quick recipe only
              </button>
            </div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Sticky Bottom Area */}
      <div className="absolute w-full bottom-0 left-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-16 pb-4 sm:pb-6 px-2 sm:px-4 pointer-events-none flex flex-col items-center z-20">
        <div className="w-full max-w-3xl flex flex-col items-center pointer-events-none items-center justify-center">
          {messages.length > 0 && (
            <div className="w-full shadow-lg rounded-[1.5rem] bg-black/60 backdrop-blur-md border border-white/20 animate-in slide-in-from-bottom-4 duration-300 pointer-events-auto">
              <PromptInputBox
                value={input}
                onChange={setInput}
                onSend={handleSend}
                isLoading={isLoading}
                placeholder="Type ingredients like: potato, onion, cheese…"
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function StreamedRecipe({ recipe }: { recipe: DeepPartial<Recipe> }) {
  if (!recipe) return null;
  return (
    <div className="pointer-events-auto space-y-5 bg-white border border-gray-100 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] animate-in zoom-in-95 duration-500 w-full overflow-hidden">
      {recipe.dishName && (
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 leading-tight">
          {recipe.dishName}
        </h2>
      )}

      {recipe.ingredientsUsed && recipe.ingredientsUsed.length > 0 && (
        <div className="pt-1 sm:pt-2">
          <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2 mb-3">Ingredients Used</h3>
          <ol className="flex flex-wrap gap-1.5 sm:gap-2">
            {recipe.ingredientsUsed.map((ing, i) => ing ? (
              <li key={i} className="bg-orange-50/50 text-gray-700 text-xs sm:text-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-full border border-orange-100/50">{ing}</li>
            ) : null)}
          </ol>
        </div>
      )}

      {recipe.steps && recipe.steps.length > 0 && (
        <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-4">
          <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">
            Chef's Instructions
          </h3>
          <ol className="space-y-2 sm:space-y-3">
            {recipe.steps.map((step, i) =>
              step ? (
                <li key={i} className="flex gap-2 sm:gap-3 text-sm leading-relaxed p-1.5 sm:p-2 hover:bg-gray-50 rounded-lg sm:rounded-xl transition-colors items-start">
                  <span className="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[10px] sm:text-xs font-bold text-orange-600 shadow-sm border border-orange-200/50 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-gray-700 font-medium pt-0.5 break-words">{step}</span>
                </li>
              ) : null
            )}
          </ol>
        </div>
      )}

      {recipe.tip && (
        <blockquote className="mt-4 border-l-4 border-emerald-400 bg-emerald-50 py-2.5 sm:py-3 pl-3 sm:pl-4 pr-3 sm:pr-4 rounded-r-lg shadow-sm">
          <p className="text-xs sm:text-sm italic text-emerald-800 font-medium leading-relaxed">
            <span className="font-bold not-italic mr-1.5">💡 Tip:</span>
            {recipe.tip}
          </p>
        </blockquote>
      )}
    </div>
  );
}

function PantryQuickSelect({ items, onSelect }: { items: string[], onSelect: (item: string) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 px-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300 pb-2">
      {items.map(item => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className="pointer-events-auto px-4 py-2 bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-sm font-semibold text-white hover:bg-black/60 hover:scale-105 transition-all shadow-sm active:scale-95 drop-shadow-md"
        >
          {item}
        </button>
      ))}
    </div>
  );
}
