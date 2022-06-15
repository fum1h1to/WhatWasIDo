import { useStopwatch } from 'react-timer-hook';

export default function StopwatchCont() {
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ 
    autoStart: false,
  });


  return (
    <div style={{textAlign: 'center'}}>
      <p>Stopwatch Demo</p>
      <div style={{fontSize: '100px'}}>
        <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </div>
      <p>{isRunning ? 'Running' : 'Not running'}</p>
      <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
      <button
        onClick={reset as unknown as React.MouseEventHandler<HTMLButtonElement>}
      >
        Reset
      </button>
    </div>
  );
}