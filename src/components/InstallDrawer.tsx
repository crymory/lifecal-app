"use client";

import React, { useState } from "react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Copy, Check, X, Zap } from "lucide-react";

interface InstallDrawerProps {
    apiUrl: string;
}

const steps = [
    {
        title: "Copy the API URL",
        description: "Tap the button below to copy the link that generates your wallpaper.",
    },
    {
        title: "Open Shortcuts App",
        description:
            'Open the "Shortcuts" app on your iPhone and create a new Automation.',
    },
    {
        title: "Set Trigger",
        description:
            'Choose "Time of Day" and set it to run daily (e.g. at 6:00 AM).',
    },
    {
        title: "Add «Get Contents of URL»",
        description:
            "Add a new action, search for \"Get Contents of URL\" and paste the copied API link.",
    },
    {
        title: "Add «Set Wallpaper»",
        description:
            'Add another action "Set Wallpaper". Use the output from the previous step as the image.',
    },
    {
        title: "Done!",
        description:
            "Your iPhone will now automatically update your lock screen wallpaper every day.",
    },
];

export default function InstallDrawer({ apiUrl }: InstallDrawerProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(apiUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
            const el = document.createElement("textarea");
            el.value = apiUrl;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white transition-all"
                >
                    <Zap className="h-4 w-4" />
                    Install on iPhone
                </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-[#111113] border-white/10 max-h-[85vh]">
                <DrawerHeader className="relative">
                    <DrawerTitle className="text-white text-lg font-semibold text-center">
                        Setup iOS Automation
                    </DrawerTitle>
                    <DrawerClose asChild>
                        <button className="absolute right-4 top-4 rounded-full bg-white/10 p-1.5 text-white/60 hover:text-white transition-colors">
                            <X className="h-4 w-4" />
                        </button>
                    </DrawerClose>
                </DrawerHeader>

                <div className="px-6 pb-8 space-y-5 overflow-y-auto">
                    {/* API URL */}
                    <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                        <p className="text-xs text-white/40 mb-1.5 font-medium uppercase tracking-wider">
                            Your API URL
                        </p>
                        <div className="flex items-center gap-2">
                            <code className="text-xs text-[#FF5F2E] font-mono flex-1 break-all leading-relaxed">
                                {apiUrl || "Configure your goal first"}
                            </code>
                            <button
                                onClick={handleCopy}
                                disabled={!apiUrl}
                                className="shrink-0 rounded-md bg-white/10 p-2 text-white/60 hover:text-white hover:bg-white/20 transition-all disabled:opacity-30"
                            >
                                {copied ? (
                                    <Check className="h-3.5 w-3.5 text-green-400" />
                                ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="space-y-4">
                        {steps.map((step, i) => (
                            <div key={i} className="flex gap-3">
                                <div className="shrink-0 flex flex-col items-center">
                                    <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-semibold text-white">
                                        {i + 1}
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div className="w-px h-full bg-white/10 mt-1" />
                                    )}
                                </div>
                                <div className="pb-2">
                                    <p className="text-white font-medium text-sm leading-tight">
                                        {step.title}
                                    </p>
                                    <p className="text-white/50 text-xs mt-0.5 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
