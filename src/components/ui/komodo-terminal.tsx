'use client'

import { useState, useRef, useEffect } from 'react'


export default function KomodoTerminal() {
  const [history, setHistory] = useState<Array<{ command: string; output: string; isWelcome?: boolean }>>([
    { command: '/welcome', output: 'Welcome to Komodo! Type komodo for help.', isWelcome: true },
  ])
  const [currentCommand, setCurrentCommand] = useState('')
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands: Record<string, () => string> = {
    'komodo': () => `
[AVAILABLE COMMANDS]

  komodo install <intent>    Set up environment based on intent
  komodo create <intent>     Create new project with intent
  komodo detect              Show detected hardware
  komodo rollback            Undo last installation
  komodo health              Check environment health
  komodo list                List installed packages
  clear                      Clear terminal screen

[EXAMPLES]
  komodo install "train an AI model"
  komodo create "build a website with React"
  komodo install "data analysis with pandas"
`,
    'komodo install': () => `
[USAGE] komodo install "<intent>"

Describe what you want to build and Komodo will:
  • Parse your intent and detect required packages
  • Detect your hardware (GPU, CPU, memory)
  • Install hardware-optimized versions
  • Create isolated virtual environment
  • Generate lockfile for reproducibility

[EXAMPLES]
  komodo install "machine learning with pytorch"
  komodo install "web scraping"
  komodo install "REST API with FastAPI"
  komodo install "data visualization"
`,
    'komodo create': () => `
[USAGE] komodo create "<intent>"

Create a new project with the right structure and dependencies.

[EXAMPLES]
  komodo create "Next.js website with authentication"
  komodo create "Python CLI tool"
  komodo create "FastAPI backend with PostgreSQL"
  komodo create "React Native mobile app"

Komodo will scaffold the project, install dependencies,
and configure everything based on your hardware.
`,
    'komodo detect': () => `
[HARDWARE DETECTION]

  OS:           macOS 14.2 (Darwin)
  Architecture: ARM64 (Apple Silicon)
  CPU:          Apple M2 Pro (12 cores)
  Memory:       32 GB
  GPU:          Apple M2 Pro (19-core GPU)
  Metal:        Supported ✓
  CUDA:         Not available

[OPTIMIZATION NOTES]
  • PyTorch will use Metal Performance Shaders
  • TensorFlow will use tensorflow-metal plugin
  • llama-cpp will compile with Metal acceleration
  • NumPy/SciPy will use Accelerate framework
`,
    'komodo rollback': () => `
[ROLLBACK SYSTEM]

Komodo creates snapshots before every change.

  komodo rollback           Undo last change
  komodo rollback --list    Show available snapshots
  komodo rollback <id>      Restore specific snapshot

[RECENT SNAPSHOTS]
  #3  2 hours ago    Installed pytorch, torchvision
  #2  1 day ago      Installed numpy, pandas, matplotlib
  #1  3 days ago     Initial environment setup

Type "komodo rollback" to undo the last change.
`,
    'komodo health': () => `
[ENVIRONMENT HEALTH CHECK]

Scanning installed packages...

✓ No version conflicts detected
✓ All dependencies satisfied
✓ No security vulnerabilities found
✓ Lock file is up to date

[INSTALLED PACKAGES] 47 packages
[VIRTUAL ENV] .venv (Python 3.11.5)
[DISK USAGE] 1.2 GB

Environment is healthy!
`,
    'komodo list': () => `
[INSTALLED PACKAGES]

Python Environment (.venv)
──────────────────────────
  torch          2.1.0+metal    (GPU-optimized)
  torchvision    0.16.0
  numpy          1.26.0         (Accelerate)
  pandas         2.1.1
  matplotlib     3.8.0
  scikit-learn   1.3.1
  transformers   4.35.0
  accelerate     0.24.0

  ... and 39 more packages

Total: 47 packages | Size: 1.2 GB
`,
    'help': () => `
Type "komodo" to see all available commands.
`,
    'clear': () => {
      setHistory([])
      return ''
    },
  }

  const handleCommand = () => {
    const cmd = currentCommand.trim().toLowerCase()

    // Check for exact match first, then partial match
    let output: string
    if (commands[cmd]) {
      output = commands[cmd]()
    } else if (cmd.startsWith('komodo install') && cmd !== 'komodo install') {
      // Simulate an actual install
      const intent = cmd.replace('komodo install', '').trim().replace(/"/g, '')
      output = `
[PARSING INTENT] "${intent}"

Detected requirements:
  • Primary: Machine Learning / AI
  • Runtime: Python 3.11
  • Framework: PyTorch (GPU-optimized)

[HARDWARE DETECTION]
  → Apple Silicon M2 Pro detected
  → Metal Performance Shaders available
  → Selecting optimized packages...

[INSTALLING]
  ✓ Created virtual environment (.venv)
  ✓ torch-2.1.0+metal (Metal acceleration)
  ✓ torchvision-0.16.0
  ✓ numpy-1.26.0 (Accelerate framework)
  ✓ transformers-4.35.0
  ✓ accelerate-0.24.0

[SNAPSHOT] Created rollback point #4

Done! Installed 6 packages in 12.3s
Activate with: source .venv/bin/activate
`
    } else if (cmd.startsWith('komodo create') && cmd !== 'komodo create') {
      const intent = cmd.replace('komodo create', '').trim().replace(/"/g, '')
      output = `
[PARSING INTENT] "${intent}"

Detected project type:
  • Type: Web Application
  • Framework: Next.js 14
  • Language: TypeScript

[SCAFFOLDING PROJECT]
  ✓ Created project structure
  ✓ Initialized package.json
  ✓ Installing dependencies...
  ✓ next@14.0.0
  ✓ react@18.2.0
  ✓ typescript@5.2.0
  ✓ tailwindcss@3.3.0
  ✓ Configured TypeScript
  ✓ Set up Tailwind CSS
  ✓ Created initial pages

[SNAPSHOT] Created rollback point #5

Done! Project created in ./my-project
Run: cd my-project && npm run dev
`
    } else {
      output = `Command not found: ${cmd}
Type "komodo" to see available commands.`
    }

    if (cmd !== 'clear') {
      setHistory(prev => [...prev, { command: currentCommand, output }])
    }

    setCurrentCommand('')
    setHistoryIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHistoryIndex(prev => {
        const newIndex = Math.min(prev + 1, history.length - 1)
        if (history.length > 0) {
          setCurrentCommand(history[history.length - 1 - newIndex]?.command || '')
        }
        return newIndex
      })
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHistoryIndex(prev => {
        const newIndex = Math.max(prev - 1, -1)
        setCurrentCommand(newIndex === -1 ? '' : history[history.length - 1 - newIndex]?.command || '')
        return newIndex
      })
    }
  }

  useEffect(() => {
    if (shouldAutoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: 'instant' })
    }
  }, [history, shouldAutoScroll])

  useEffect(() => {
    const handleClick = () => {
      inputRef.current?.focus()
    }

    const terminal = terminalRef.current
    if (terminal) {
      terminal.addEventListener('click', handleClick)
    }

    return () => {
      if (terminal) {
        terminal.removeEventListener('click', handleClick)
      }
    }
  }, [])

  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden shadow-2xl border border-[#98d998]/30 flex flex-col">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 p-3 bg-[#161b22] text-xs text-gray-400 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="flex-1 text-center font-semibold text-gray-500">komodo-terminal</div>
        <div className="text-xs">
          <span className="text-[#98d998]">●</span> READY
        </div>
      </div>

      {/* Terminal Output */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0d1117] cursor-text"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#98d998 #161b22'
        }}
        onScroll={(e) => {
          const el = e.currentTarget
          const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50
          setShouldAutoScroll(isAtBottom)
        }}
      >
        {history.map((entry, i) => (
          <div key={i} className="space-y-2">
            {entry.command !== '/welcome' && (
              <div className="flex gap-2">
                <span className="text-[#98d998] font-semibold">~$</span>
                <span className="text-white">{entry.command}</span>
              </div>
            )}
            {entry.isWelcome && (
              <div className="mb-2">
                <span className="text-3xl font-bold bg-gradient-to-r from-[#d4f5d4] via-[#98d998] to-[#5cb85c] bg-clip-text text-transparent">
                  KOMODO
                </span>
                <span className="text-gray-500 ml-2 text-sm">v1.0.0</span>
              </div>
            )}
            <div className="whitespace-pre-wrap text-gray-300 leading-relaxed font-mono text-sm">
              {entry.output}
            </div>
          </div>
        ))}

        {/* Current Command Input */}
        <div className="flex gap-2 items-center">
          <span className="text-[#98d998] font-semibold">~$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={e => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-white caret-[#98d998] font-mono"
            spellCheck="false"
          />
          <span className="text-[#98d998] animate-pulse">█</span>
        </div>

        <div ref={bottomRef} />
      </div>

      {/* Terminal Footer */}
      <div className="bg-[#161b22] px-4 py-2 text-xs text-gray-500 border-t border-gray-800 shrink-0">
        <div className="flex justify-between items-center">
          <span>Type <span className="text-[#98d998]">komodo</span> for help • Use ↑/↓ for history</span>
          <span>clear to reset</span>
        </div>
      </div>
    </div>
  )
}
