import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image'

import IconAudio from '/public/static/images/audio.svg';

const RecordAudio = ({isRecordable, audioData, saveAudio, isAudioLoading} : any) => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [playStatus, setPlayStatus] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [color, setColor] = useState("red");

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

  useEffect(() => {
    let intervalId: number | undefined;
    if (isRunning) {
      intervalId = window.setInterval(() => {
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
    handleConvertToBlob(audioData);
  }, [audioData]);

  useEffect(() => {
    setIsLoading(isAudioLoading);
  }, [isAudioLoading]);

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  // const audioRef = useRef<HTMLAudioElement>(null);

  const [sourceNode, setSourceNode] = useState<AudioBufferSourceNode | null>(null);

  const handleStart = async () => {
    setIsRunning(true);
    pauseAudio();
    // const audioContext = new AudioContext();
    setAudioBlob(null);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    const chunks: any = [];

    mediaRecorder.start();
    setTimeout(handleStop, 90000);

    mediaRecorder.ondataavailable = event => {
      chunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
      console.log(blob)
      setAudioBlob(blob);
      saveAudio(blob);
    };

    setRecording(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    setTime(0);
    setRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
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
      <div className='w-full h-full min-h-[220px] rounded-xl mt-[10px] flex flex-col justify-between py-5 shadow-md'>
        <div className='font-Inter text-center'>
          <h2 className='font-bold text-[20px] text-primary-black'>Elevator pitch</h2>
          <p className="text-[12px] px-2">practice, listen, repeat your 90 second story</p>
        </div>
        <div className='flex justify-center'>
          {/* {audioBlob ? <audio controls src={URL.createObjectURL(audioBlob)} ref={audioRef} /> : <Image src={ico_audio} alt={'ico_audio'} />} */}
          {
            isRunning ?
              <div className='flex flex-row w-full justify-center items-center gap-2'>
                <div className='w-[20px] h-[20px] bg-red-600 rounded-full'></div>
                <p className='font-Inter text-[20px] font-semibold'>{hours < 10 ? `0${hours}` : hours}:{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}</p>
              </div> :
              (playStatus ?
                <div style={{ backgroundColor: color }} className='w-[20px] h-[20px] rounded-full'></div> :
                // <Image src={ico_audio} alt={'ico_audio'} />
                <IconAudio alt={'ico_audio'} />
              )
          }


        </div>
        {!audioBlob &&
          <div className='text-center'>
            {
              recording ?
              <button onClick={handleStop} className='font-Inter font-semibold text-[16px] text-secondary-gray-4'>Stop</button>
              : 
                isRecordable ? 
                <button onClick={handleStart} className='font-Inter font-semibold text-[16px] text-secondary-gray-4'>Create</button>
                : <>{isLoading ? 'Loading...': 'No Audio'}</>
            }
          </div>
        }

        {audioBlob &&
          <div className='text-center flex flex-row justify-around'>
            {playStatus ?
              <button onClick={pauseAudio} className='font-Inter font-semibold text-[16px] text-secondary-gray-4'>Pause</button> :
              <button onClick={playAudio} className='font-Inter font-semibold text-[16px] text-secondary-gray-4'>Play</button>
            }
            {
              isRecordable && <button onClick={handleStart} className='font-Inter font-semibold text-[16px] text-secondary-gray-4'>Update</button> 
            }
            {/* <audio src={URL.createObjectURL(audioBlob)} ref={audioRef} /> */}
          </div>
        }

      </div>
    </div>

  );
};

export default RecordAudio;
