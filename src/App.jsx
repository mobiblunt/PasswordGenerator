import { useState, useCallback, useEffect, useRef } from 'react'
import { FaCopy, FaRedo, FaCheck } from 'react-icons/fa'

function App() {
  const [length, setLength] = useState(12)
  const [numberAllowed, setNumberAllowed] = useState(true)
  const [charAllowed, setCharAllowed] = useState(true)
  const [password, setPassword] = useState("")
  const [copied, setCopied] = useState(false)
  const [strength, setStrength] = useState(0)

  const passwordRef = useRef(null)

  const passwordGenerator = useCallback(() => {
    let pass = ""
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    if (numberAllowed) str += "0123456789"
    if (charAllowed) str += "!@#$%^&*-_+=[]{}~`"

    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length)
      pass += str.charAt(char)
    }

    setPassword(pass)
    setCopied(false)
    calculateStrength(pass)
  }, [length, numberAllowed, charAllowed])

  const calculateStrength = (pass) => {
    let s = 0
    s += pass.length > 8 ? 1 : 0
    s += /[0-9]/.test(pass) ? 1 : 0
    s += /[^A-Za-z0-9]/.test(pass) ? 1 : 0
    s += pass.length > 12 ? 1 : 0
    setStrength(s)
  }

  const copyToClipboard = useCallback(() => {
    passwordRef.current?.select()
    passwordRef.current?.setSelectionRange(0, 100)
    window.navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [password])

  useEffect(() => {
    passwordGenerator()
  }, [length, numberAllowed, charAllowed, passwordGenerator])

  const getStrengthColor = () => {
    if (strength <= 1) return 'bg-red-500'
    if (strength === 2) return 'bg-yellow-500'
    if (strength === 3) return 'bg-blue-500'
    return 'bg-green-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <h1 className='text-3xl font-bold text-center text-gray-800 mb-8'>Password Forge</h1>
        <div className="relative mb-6">
          <input
            type="text"
            value={password}
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your secure password"
            readOnly
            ref={passwordRef}
          />
          <button
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors ${copied ? 'text-green-500' : ''}`}
            onClick={copyToClipboard}
            title={copied ? "Copied!" : "Copy to clipboard"}
          >
            {copied ? <FaCheck size={20} /> : <FaCopy size={20} />}
          </button>
        </div>
        <div className='mb-6'>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password Length: {length}</label>
          <input 
            type="range"
            min={6}
            max={30}
            value={length}
            className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
            onChange={(e) => setLength(e.target.value)}
          />
        </div>
        <div className='flex justify-between mb-6'>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={numberAllowed}
              onChange={() => setNumberAllowed(prev => !prev)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-gray-700">Include Numbers</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={charAllowed}
              onChange={() => setCharAllowed(prev => !prev)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-gray-700">Include Symbols</span>
          </label>
        </div>
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Password Strength</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className={`h-2.5 rounded-full ${getStrengthColor()}`} style={{width: `${(strength / 4) * 100}%`}}></div>
          </div>
        </div>
        <button
          className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-lg font-semibold'
          onClick={passwordGenerator}
        >
          <FaRedo className="mr-2" /> Generate New Password
        </button>
      </div>
    </div>
  )
}

export default App
