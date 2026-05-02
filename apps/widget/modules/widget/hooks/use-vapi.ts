import Vapi from "@vapi-ai/web";
import { useEffect, useState } from "react"

interface TranscriptMessage {
   role: "user" | "assistant";
   text: String;
};

export const useVapi = () => {
    const [vapi, setvapi] = useState<Vapi | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState<TranscriptMessage[]>( [] );

    useEffect(() => {
        // only for testing the vapi API, otherxise customer will provide their own API keys
        const vapiInstance = new Vapi("85ff2d2e-d9f9-4cab-9e7d-27804fd70dff");
         setvapi(vapiInstance);
         
         vapiInstance.on("call-start", () => {
            setIsConnected(false);
            setIsConnecting(false);
            setIsSpeaking(false);
        });

        vapiInstance.on("call-end", () => {
            setIsConnected(false);
            setIsConnecting(false);
            setIsSpeaking(false);
        });

        vapiInstance.on("speech-start", () => {
            setIsSpeaking(true);
        });

        vapiInstance.on("speech-end", () => {
            setIsSpeaking(false);
        });

        vapiInstance.on("error", (error) => {
            console.log(error, "VAPI_ERROR");
            setIsConnecting(false);
        });

        vapiInstance.on("message", (message) => {
            if(message.type === "transcript" && message.transcriptType === "final") {
                setTranscript((prev) => [
                    ...prev,
                    {
                         role: (message.role === "user" ? "user" : "assistant") as "user" | "assistant",
                text: message.transcript,
                    }
                ]);
            }
        });
        return () => {
            vapiInstance?.stop();
        }

    }, []);

    const startCall = () => {
        setIsConnecting(true);

        if (vapi) {
            // only for testing the vapi API, otherxise customer will provide their own Assistant IDs
            vapi.start("7581abf5-c98a-4218-96fd-4e66d8937000")
        }
    }

    const endCall = () => {
        if (vapi) {
            vapi.stop();
        }
    };

    return {
        isSpeaking, 
        isConnected, 
        isConnecting, 
        transcript, 
        startCall,
        endCall
    }
};