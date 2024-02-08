import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image'

import IconAudio from '/public/static/images/audio.svg';

const AudioPlayer = ({audioData} : any) => {
    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [playStatus, setPlayStatus] = useState(false);

    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [color, setColor] = useState("red");

    useEffect(() => {
        let intervalId: NodeJS.Timer | undefined;
        if (isRunning) {
            intervalId = setInterval(() => {
                setTime((time) => time + 1);
            }, 1000);
        }
        return () => clearInterval(intervalId);
    }, [isRunning]);

    useEffect(() => {
        const interval = setInterval(() => {
        setColor((prev) => (prev === "red" ? "blue" : "red"));
        }, 1000); // change color every 500ms

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setIsLoading(true);
        handleConvertToBlob(audioData);
        setIsLoading(false);
    }, [audioData]);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    const [sourceNode, setSourceNode] = useState<AudioBufferSourceNode | null>(null);

    const handleStop = () => {
        setIsRunning(false);
        setTime(0);
        setRecording(false);
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
    };

    const handleConvertToBlob = async (url: string) => {
        if (url != null) {
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                setAudioBlob(blob);
            } catch (error) {
                console.error('Error converting URL to Blob:', error);
            }
        }
    };

    const playAudio = async (): Promise<void> => {
        setPlayStatus(true);
        const audioContext = new AudioContext();
        const arrayBuffer = await audioBlob?.arrayBuffer();
        if (arrayBuffer) {
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            const node = audioContext.createBufferSource();
            node.buffer = audioBuffer;
            node.connect(audioContext.destination);
            node.start();
            node.addEventListener('ended', () => {
                setPlayStatus(false);
            })
            setSourceNode(node);
        }
    }

    const pauseAudio = () => {
        setPlayStatus(false);
        sourceNode?.stop();
    }

    return (
        <div>
            <div className='w-full mt-[10px] flex justify-center py-[10px]'>
                <div className='flex justify-center'>
                    {/* <Image src={ico_audio} alt={'ico_audio'} /> */}
                    <IconAudio alt={'ico_audio'} />
                </div>
                {   
                    audioBlob &&
                    <div className='text-center flex flex-row justify-around ml-[15px]'>
                        {
                            isLoading ? 
                            <p className='font-Inter font-semibold text-[16px] text-[#6F727A]'>Loading ...</p>
                            : 
                            playStatus ?
                            <button onClick={pauseAudio} className='font-Inter font-semibold text-[16px] text-[#6F727A]'>Pause</button> :
                            <button onClick={playAudio} className='font-Inter font-semibold text-[16px] text-[#6F727A]'>Play</button>
                        }
                    </div>
                }
            </div>
        </div>
    );
};

export default AudioPlayer;
