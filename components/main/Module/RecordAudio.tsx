import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image'

import ico_audio from '/public/static/images/audio.svg';
import ico_recording from '/public/static/images/recording.gif';

const RecordAudio = () => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [playStatus, setPlayStatus] = useState(false);

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
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

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
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

    mediaRecorder.ondataavailable = event => {
      chunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
      console.log(blob)
      setAudioBlob(blob);
    };

    setRecording(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    setTime(0);
    setRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
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
      <div className='w-[240px] h-[160px] bg-gray-400 rounded-xl'>
        <button onClick={handleStart}>Start Recording</button>
        {recording && <button onClick={handleStop}>Stop Recording</button>}
        {audioBlob && (
          <audio controls src={URL.createObjectURL(audioBlob)} />
        )}
      </div>

      <div className='w-[240px] h-[160px] rounded-xl mt-[100px] border-2 border-black flex flex-col justify-between py-[10px]'>
        <div className='text-center'>
          <label className='font-Inter font-bold text-[24px] text-[#232325]'>Elevator pitch</label>
        </div>
        <div className='flex justify-center'>
          {/* {audioBlob ? <audio controls src={URL.createObjectURL(audioBlob)} ref={audioRef} /> : <Image src={ico_audio} alt={'ico_audio'} />} */}
          {
            isRunning ?
              <div className='flex flex-row w-full pl-[60px] items-center gap-2'>
                <div className='w-[20px] h-[20px] bg-red-600 rounded-full'></div>
                <p className='font-Inter text-[20px] font-semibold'>{hours < 10 ? `0${hours}` : hours}:{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}</p>
              </div> :
              (playStatus ?
                <div style={{ backgroundColor: color }} className='w-[20px] h-[20px] rounded-full'></div> :
                <Image src={ico_audio} alt={'ico_audio'} />
              )
          }


        </div>
        {!audioBlob &&
          <div className='text-center'>
            {recording ?
              <button onClick={handleStop} className='font-Inter font-semibold text-[16px] text-[#6F727A]'>stop</button>
              : <button onClick={handleStart} className='font-Inter font-semibold text-[16px] text-[#6F727A]'>create</button>}
          </div>
        }

        {audioBlob &&
          <div className='text-center flex flex-row justify-around'>
            {playStatus ?
              <button onClick={pauseAudio} className='font-Inter font-semibold text-[16px] text-[#6F727A]'>Pause</button> :
              <button onClick={playAudio} className='font-Inter font-semibold text-[16px] text-[#6F727A]'>Play</button>
            }
            <button onClick={handleStart} className='font-Inter font-semibold text-[16px] text-[#6F727A]'>Update</button>
            {/* <audio src={URL.createObjectURL(audioBlob)} ref={audioRef} /> */}
          </div>
        }

      </div>
    </div>

  );
};

export default RecordAudio;
