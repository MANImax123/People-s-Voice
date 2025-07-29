"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const GOOGLE_TRANSLATE_API = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { enableVoice?: boolean; language?: string }>(
  ({ className, type, enableVoice, ...props }, ref) => {
    const [voiceState, setVoiceState] = React.useState<'idle' | 'listening' | 'processing'>('idle');
    const recognitionRef = React.useRef<any>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => { setMounted(true); }, []);
    React.useImperativeHandle(ref, () => inputRef.current!, [inputRef]);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const translateToEnglish = async (text: string) => {
      const url = GOOGLE_TRANSLATE_API + encodeURIComponent(text);
      const res = await fetch(url);
      const data = await res.json();
      return data[0][0][0];
    };

    const startVoice = () => {
      console.log('Voice: startVoice called');
      if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        alert('Voice recognition not supported in this browser.');
        return;
      }
      setVoiceState('listening');
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'auto';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = async (event: any) => {
        console.log('Voice: onresult', event);
        setVoiceState('processing');
        let transcript = event.results[0][0].transcript;
        const detectedLang = event.results[0][0].language || '';
        if (!detectedLang.startsWith('en')) {
          transcript = await translateToEnglish(transcript);
        }
        if (inputRef.current) {
          const val = inputRef.current.value;
          const newValue = val ? val + ' ' + transcript : transcript;
          if (props.onChange) {
            const syntheticEvent = {
              ...event,
              target: {
                ...inputRef.current,
                value: newValue,
                name: props.name,
              },
            };
            props.onChange(syntheticEvent as any);
          } else {
            inputRef.current.value = newValue;
          }
          inputRef.current.focus();
          inputRef.current.setSelectionRange(newValue.length, newValue.length);
        }
        recognition.stop();
      };
      recognition.onerror = (e: any) => {
        console.log('Voice: onerror', e);
        setVoiceState('idle');
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
      recognition.onend = () => {
        console.log('Voice: onend');
        setVoiceState('idle');
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
      recognition.onaudiostart = () => console.log('Voice: onaudiostart');
      recognition.onaudioend = () => console.log('Voice: onaudioend');
      recognition.onspeechstart = () => console.log('Voice: onspeechstart');
      recognition.onspeechend = () => console.log('Voice: onspeechend');
      recognitionRef.current = recognition;
      recognition.start();
      timeoutRef.current = setTimeout(() => {
        console.log('Voice: timeout, stopping recognition');
        recognition.stop();
        setVoiceState('idle');
      }, 10000);
    };

    const stopVoice = () => {
      setVoiceState('processing');
      recognitionRef.current?.stop();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pr-12",
            className
          )}
          ref={inputRef}
          {...props}
        />
        {enableVoice && mounted && (
          <div className="absolute inset-y-0 right-2 flex items-center">
            {voiceState === 'idle' && (
              <button type="button" aria-label="Start voice input" onClick={startVoice} className="text-gray-400 hover:text-blue-600 focus:outline-none text-xl">
                <span role="img" aria-label="mic">🎤</span>
              </button>
            )}
            {voiceState === 'listening' && (
              <div className="flex items-center gap-2">
                <span className="animate-pulse text-blue-600 text-xl">🎤</span>
                <button type="button" aria-label="Stop voice input" onClick={stopVoice} className="ml-1 text-red-500 hover:text-red-700 focus:outline-none text-lg font-bold">■</button>
              </div>
            )}
            {voiceState === 'processing' && (
              <span className="animate-spin text-blue-500 text-xl">⏳</span>
            )}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
