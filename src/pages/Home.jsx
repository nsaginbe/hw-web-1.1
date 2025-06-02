import React, { useEffect, useState } from 'react'
import './Home.css'

const phrases = [
  'Strut fierce, crush doubt!',
  'Own the stage, shine bright!',
  'Unleash your power, rise up!',
  'Slay the day, own your way!',
  'Boss up, glow up!'
]

const timerOptions = [10, 20, 30]

function Home() {
  const [name, setName] = useState(() => localStorage.getItem('name') || '')
  const [selectedTime, setSelectedTime] = useState("")
  const [countdown, setCountdown] = useState(selectedTime)
  const [isRunning, setRunning] = useState(false)
  const [isFinished, setFinished] = useState(false)
  const [phrase, setPhrase] = useState('')
  const [completionCount, setCompletionCount] = useState(() => {
    const saved = localStorage.getItem('completionCount')
    return saved ? parseInt(saved) : 0
  })

  useEffect(() => {
    let timer;

    if (isRunning && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    }

    if (countdown === 0 && isRunning) {
      setRunning(false)
      setFinished(true)

      setCompletionCount(prev => {
        const newCount = prev + 1
        localStorage.setItem('completionCount', newCount.toString())
        return newCount
      })
    }

    return () => clearInterval(timer)

  }, [isRunning, countdown])

  useEffect(() => {
    if (name) {
      localStorage.setItem('name', name)
    }
  }, [name])

  const handleStart = () => {
    if (name.trim() !== '') {
      setRunning(true)
      setFinished(false)
      setCountdown(selectedTime)
      setPhrase(phrases[Math.floor(Math.random() * phrases.length)])
    }
  }

  const handleReset = () => {
    setCountdown(selectedTime)
    setRunning(false)
    setFinished(false)
    setPhrase('')
  }

  const progress = ((selectedTime - countdown) / selectedTime) * 100

  return (
    <div className="home-container">
      {!isRunning && !isFinished && (
        <>
          <div className="input-group">
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="name-input"
            />

            <select 
              value={selectedTime} 
              onChange={(e) => setSelectedTime(Number(e.target.value))}
              className="timer-select">
              
              {timerOptions.map(time => (
                <option key={time} value={time}>{time} sec</option>
              ))}
            </select>
          </div>
          <button onClick={handleStart} className="start-button">Start</button>
        </>
      )}

      {isRunning && (
        <div className="timer-container">
          <h3>{name}, there is {countdown} secs left!</h3>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      
      {isFinished && (
        <div className="completion-container">
          <h3>Good job, {name}!</h3>
          <p className="motivation-phrase">{phrase}</p>
          <p className="completion-count">You've completed {completionCount} sessions!</p>
          <div className="button-group">
            <button onClick={handleStart} className="restart-button">Restart</button>
            <button onClick={handleReset} className="reset-button">Reset</button>
          </div>
        </div>
      )}

      {isRunning && (
        <div className="button-group">
          <button onClick={handleReset} className="reset-button">Reset</button>
        </div>
      )}
    </div>
  )
}

export default Home